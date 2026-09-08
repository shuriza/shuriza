<?php

namespace App\Services;

use App\Enums\TicketEventType;
use App\Enums\TicketStatus;
use App\Models\Ticket;

/**
 * Hasil resolusi konflik antara status tiket lokal dan event dari pusat.
 *
 * Nilai ini murni hasil perhitungan — tidak ada efek samping. Panggil
 * terlebih dahulu, lalu putuskan apakah state remote perlu diterapkan.
 */
final readonly class ConflictOutcome
{
    public function __construct(
        /** Apakah state remote harus menimpa state lokal. */
        public bool $shouldApplyRemote,
        /** Alasan keputusan, untuk ditampilkan/dicatat saat debug. */
        public string $reason,
        /** Sisi yang menang: 'local', 'remote', atau 'identical'. */
        public string $winner,
    ) {}
}

/**
 * Resolusi konflik deterministik antara tiket lokal dan event remote.
 *
 * Dua mesin yang menerima pasangan (lokal, remote) yang SAMA harus selalu
 * menghasilkan pemenang yang SAMA — itulah syarat konvergensi sistem
 * offline-first. Karena itu semua aturan di bawah hanya bergantung pada
 * data, bukan pada jam dinding, urutan kedatangan, atau acakan.
 *
 * Aturan, berurutan (pertama yang cocok menang):
 *
 * 1. Payload remote harus valid sepenuhnya sebelum apa pun diputuskan.
 *    Event rusak tidak boleh lolos hanya karena tiket lokal belum ada.
 *
 * 2. Tiket belum ada di perangkat ini -> terapkan remote.
 *
 * 3. Revision lebih tinggi menang.
 *    `revision` adalah penghitung ala Lamport yang dinaikkan pada setiap
 *    transisi status. Ia mengkodekan KAUSALITAS, bukan waktu — jam di
 *    mesin offline bisa meleset (baterai CMOS habis, NTP mati), jadi
 *    membandingkan `occurred_at` tidak bisa diandalkan.
 *
 * 4. Revision sama + status sama + perangkat asal sama -> identik.
 *    Event yang sama sampai dua kali (retry, re-broadcast); abaikan.
 *
 * 5. Revision sama, status berbeda -> status dengan prioritas lebih tinggi
 *    menang. Ini menutup tie yang sama-originnya tanpa bergantung pada
 *    arah pembandingan.
 *
 * 6. Revision sama, status sama, perangkat asal berbeda -> perangkat asal
 *    yang lebih kecil secara numerik menang; jika nilainya setara atau bukan
 *    bilangan murni, bandingkan bentuk string sebagai tie-breaker terakhir.
 */
class ConflictResolver
{
    /**
     * @param  array{
     *     event_uuid?: string,
     *     event_type?: string,
     *     ticket_uuid?: string,
     *     status?: string,
     *     revision?: int|string,
     *     origin_device_id?: string,
     *     counter_uuid?: ?string,
     *     number?: int|string,
     *     label?: string,
     *     service_code?: string,
     *     service_date?: string,
     *     occurred_at?: string,
     * }  $remote  Payload event/tiket ter-dekode dari pusat.
     */
    public function resolve(?Ticket $local, array $remote): ConflictOutcome
    {
        $normalizedRemote = $this->normalizeRemote($remote);

        if ($normalizedRemote === null) {
            return new ConflictOutcome(
                shouldApplyRemote: false,
                reason: 'payload remote tidak lengkap atau tidak valid; state lokal dipertahankan',
                winner: 'local',
            );
        }

        if ($local === null) {
            return new ConflictOutcome(
                shouldApplyRemote: true,
                reason: 'tiket belum ada di perangkat ini',
                winner: 'remote',
            );
        }

        $localStatus = $this->normalizeStatus($local->status);
        $localRevision = (int) $local->revision;
        $localOrigin = (string) ($local->origin_device_id ?? '');

        [$remoteStatus, $remoteRevision, $remoteOrigin] = $normalizedRemote;

        $comparison = $this->compareSnapshots(
            $remoteStatus,
            $remoteRevision,
            $remoteOrigin,
            $localStatus,
            $localRevision,
            $localOrigin,
        );

        if ($comparison > 0) {
            return new ConflictOutcome(
                shouldApplyRemote: true,
                reason: $this->explainRemoteWin($remoteStatus, $remoteRevision, $remoteOrigin, $localStatus, $localRevision, $localOrigin),
                winner: 'remote',
            );
        }

        if ($comparison < 0) {
            return new ConflictOutcome(
                shouldApplyRemote: false,
                reason: $this->explainLocalWin($remoteStatus, $remoteRevision, $remoteOrigin, $localStatus, $localRevision, $localOrigin),
                winner: 'local',
            );
        }

        return new ConflictOutcome(
            shouldApplyRemote: false,
            reason: 'revisi, status, dan perangkat asal sama; event identik, diabaikan',
            winner: 'identical',
        );
    }

    /**
     * @return array{0: TicketStatus, 1: int, 2: string}|null
     */
    private function normalizeRemote(array $remote): ?array
    {
        if (! $this->requireString($remote['event_uuid'] ?? null)) {
            return null;
        }

        $eventType = $this->parseEventType($remote['event_type'] ?? null);
        $ticketUuid = $this->requireString($remote['ticket_uuid'] ?? null);
        $status = $this->normalizeStatus($remote['status'] ?? null);
        $revision = $this->parseRevision($remote['revision'] ?? null);
        $origin = $this->requireString($remote['origin_device_id'] ?? null);
        $serviceCode = $this->requireString($remote['service_code'] ?? null);
        $serviceDate = $this->requireString($remote['service_date'] ?? null);
        $number = $this->parsePositiveInt($remote['number'] ?? null);
        $label = $this->requireString($remote['label'] ?? null);

        if (
            $eventType === null
            || $ticketUuid === null
            || $status === null
            || $revision === null
            || $origin === null
            || $serviceCode === null
            || $serviceDate === null
            || $number === null
            || $label === null
        ) {
            return null;
        }

        if (! $this->eventTypeMatchesStatus($eventType, $status)) {
            return null;
        }

        return [$status, $revision, $origin];
    }

    private function compareSnapshots(
        TicketStatus $leftStatus,
        int $leftRevision,
        string $leftOrigin,
        TicketStatus $rightStatus,
        int $rightRevision,
        string $rightOrigin,
    ): int {
        if ($leftRevision !== $rightRevision) {
            return $leftRevision <=> $rightRevision;
        }

        $leftTerminal = $leftStatus->isTerminal() ? 1 : 0;
        $rightTerminal = $rightStatus->isTerminal() ? 1 : 0;

        if ($leftTerminal !== $rightTerminal) {
            return $leftTerminal <=> $rightTerminal;
        }

        $leftPriority = $this->statusPriority($leftStatus);
        $rightPriority = $this->statusPriority($rightStatus);

        if ($leftPriority !== $rightPriority) {
            return $leftPriority <=> $rightPriority;
        }

        return $this->compareDeviceIds($leftOrigin, $rightOrigin);
    }

    private function statusPriority(TicketStatus $status): int
    {
        return match ($status) {
            TicketStatus::Menunggu => 0,
            TicketStatus::Dipanggil => 1,
            TicketStatus::Dilewati => 2,
            TicketStatus::Selesai => 3,
        };
    }

    private function compareDeviceIds(string $left, string $right): int
    {
        if (preg_match('/^\d+$/', $left) === 1 && preg_match('/^\d+$/', $right) === 1) {
            $normalizedLeft = ltrim($left, '0') ?: '0';
            $normalizedRight = ltrim($right, '0') ?: '0';
            $lengthComparison = strlen($normalizedRight) <=> strlen($normalizedLeft);

            if ($lengthComparison !== 0) {
                return $lengthComparison;
            }

            $valueComparison = strcmp($normalizedRight, $normalizedLeft);

            if ($valueComparison !== 0) {
                return $valueComparison;
            }
        }

        return strcmp($right, $left);
    }

    private function explainRemoteWin(
        TicketStatus $remoteStatus,
        int $remoteRevision,
        string $remoteOrigin,
        TicketStatus $localStatus,
        int $localRevision,
        string $localOrigin,
    ): string {
        if ($remoteRevision !== $localRevision) {
            return "revisi remote ({$remoteRevision}) lebih baru dari revisi lokal ({$localRevision})";
        }

        if ($remoteStatus->isTerminal() !== $localStatus->isTerminal()) {
            return $remoteStatus->isTerminal()
                ? 'status remote sudah terminal sedangkan lokal belum'
                : 'status lokal sudah terminal sedangkan remote belum';
        }

        if ($this->statusPriority($remoteStatus) !== $this->statusPriority($localStatus)) {
            return "status remote ({$remoteStatus->value}) memiliki prioritas lebih tinggi dari lokal ({$localStatus->value})";
        }

        return $this->compareDeviceIds($remoteOrigin, $localOrigin) > 0
            ? "perangkat asal remote ({$remoteOrigin}) lebih kecil dari lokal ({$localOrigin})"
            : 'state identik';
    }

    private function explainLocalWin(
        TicketStatus $remoteStatus,
        int $remoteRevision,
        string $remoteOrigin,
        TicketStatus $localStatus,
        int $localRevision,
        string $localOrigin,
    ): string {
        if ($remoteRevision !== $localRevision) {
            return "revisi lokal ({$localRevision}) lebih baru dari revisi remote ({$remoteRevision})";
        }

        if ($remoteStatus->isTerminal() !== $localStatus->isTerminal()) {
            return $localStatus->isTerminal()
                ? 'status lokal sudah terminal sedangkan remote belum'
                : 'status remote sudah terminal sedangkan lokal belum';
        }

        if ($this->statusPriority($remoteStatus) !== $this->statusPriority($localStatus)) {
            return "status lokal ({$localStatus->value}) memiliki prioritas lebih tinggi dari remote ({$remoteStatus->value})";
        }

        return $this->compareDeviceIds($remoteOrigin, $localOrigin) < 0
            ? "perangkat asal lokal ({$localOrigin}) lebih kecil dari remote ({$remoteOrigin})"
            : 'state identik';
    }

    private function normalizeStatus(mixed $status): ?TicketStatus
    {
        if ($status instanceof TicketStatus) {
            return $status;
        }

        if (! is_string($status)) {
            return null;
        }

        return TicketStatus::tryFrom($status);
    }

    private function parseEventType(mixed $type): ?TicketEventType
    {
        if ($type instanceof TicketEventType) {
            return $type;
        }

        if (! is_string($type)) {
            return null;
        }

        return TicketEventType::tryFrom($type);
    }

    private function parseRevision(mixed $revision): ?int
    {
        if (is_int($revision)) {
            return $revision >= 1 ? $revision : null;
        }

        if (is_string($revision) && preg_match('/^\d+$/', $revision) === 1) {
            $value = (int) $revision;

            return $value >= 1 ? $value : null;
        }

        return null;
    }

    private function parsePositiveInt(mixed $value): ?int
    {
        if (is_int($value)) {
            return $value >= 1 ? $value : null;
        }

        if (is_string($value) && preg_match('/^\d+$/', $value) === 1) {
            $parsed = (int) $value;

            return $parsed >= 1 ? $parsed : null;
        }

        return null;
    }

    private function requireString(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }

    private function eventTypeMatchesStatus(TicketEventType $eventType, TicketStatus $status): bool
    {
        return match ($eventType) {
            TicketEventType::Issued => $status === TicketStatus::Menunggu,
            TicketEventType::Called => $status === TicketStatus::Dipanggil,
            TicketEventType::Finished => $status === TicketStatus::Selesai,
            TicketEventType::Skipped => $status === TicketStatus::Dilewati,
        };
    }
}
