<?php

namespace App\Console\Commands;

use App\Models\Memory;
use App\Services\MediaScraper;
use Illuminate\Console\Command;

class ScrapeMemories extends Command
{
    protected $signature = 'memories:scrape
                            {--all : Scrape semua memories, bukan hanya yang belum punya metadata}
                            {--id= : Scrape memory tertentu berdasarkan ID}
                            {--url= : Scrape URL baru dan simpan sebagai memory baru}';

    protected $description = 'Scrape/crawl metadata dari URL memories (thumbnail, title, embed code)';

    public function __construct(
        private MediaScraper $scraper
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        // Mode: Scrape URL baru
        if ($url = $this->option('url')) {
            return $this->scrapeNewUrl($url);
        }

        // Mode: Scrape memory tertentu
        if ($id = $this->option('id')) {
            return $this->scrapeById((int) $id);
        }

        // Mode: Batch scrape
        return $this->batchScrape();
    }

    /**
     * Scrape URL baru dan simpan sebagai memory
     */
    private function scrapeNewUrl(string $url): int
    {
        $this->info("Scraping URL: {$url}");

        $metadata = $this->scraper->scrape($url);

        if (empty($metadata['title']) && empty($metadata['thumbnail_url'])) {
            $this->warn("Tidak bisa mendapatkan metadata dari URL ini.");
            $this->table(
                ['Field', 'Value'],
                collect($metadata)->map(fn($v, $k) => [$k, is_null($v) ? '(null)' : (strlen($v) > 80 ? substr($v, 0, 80) . '...' : $v)])->toArray()
            );
            return self::FAILURE;
        }

        $this->info("Metadata berhasil di-scrape:");
        $this->table(
            ['Field', 'Value'],
            [
                ['Platform', $metadata['platform'] ?? '-'],
                ['Title', $metadata['title'] ?? '-'],
                ['Description', substr($metadata['description'] ?? '-', 0, 80)],
                ['Thumbnail', $metadata['thumbnail_url'] ?? '-'],
                ['Type', $metadata['type'] ?? '-'],
                ['Author', $metadata['author'] ?? '-'],
            ]
        );

        if ($this->confirm('Simpan sebagai memory baru?', true)) {
            $title = $this->ask('Judul (kosongkan untuk pakai hasil scrape)', $metadata['title'] ?: 'Kenangan Desa Muneng');
            $description = $this->ask('Deskripsi (kosongkan untuk pakai hasil scrape)', $metadata['description'] ?: '');

            Memory::create([
                'title' => $title,
                'description' => $description,
                'type' => $metadata['type'] ?? 'video',
                'platform' => $metadata['platform'] ?? 'youtube',
                'source_url' => $url,
                'embed_code' => $metadata['embed_code'],
                'thumbnail_url' => $metadata['thumbnail_url'],
                'status' => 'approved',
                'submitted_by' => 1, // Admin
                'approved_by' => 1,
                'approved_at' => now(),
            ]);

            $this->info("Memory berhasil disimpan!");
        }

        return self::SUCCESS;
    }

    /**
     * Scrape memory tertentu berdasarkan ID
     */
    private function scrapeById(int $id): int
    {
        $memory = Memory::find($id);

        if (!$memory) {
            $this->error("Memory dengan ID {$id} tidak ditemukan.");
            return self::FAILURE;
        }

        $this->info("Scraping: {$memory->title} ({$memory->source_url})");

        $metadata = $this->scraper->scrape($memory->source_url);

        $updated = false;

        if (!empty($metadata['title']) && empty($memory->title)) {
            $memory->title = $metadata['title'];
            $updated = true;
        }

        if (!empty($metadata['thumbnail_url']) && empty($memory->thumbnail_url)) {
            $memory->thumbnail_url = $metadata['thumbnail_url'];
            $updated = true;
        }

        if (!empty($metadata['embed_code']) && empty($memory->embed_code)) {
            $memory->embed_code = $metadata['embed_code'];
            $updated = true;
        }

        if ($updated) {
            $memory->save();
            $this->info("Memory #{$id} berhasil diupdate.");
        } else {
            $this->info("Memory #{$id} sudah memiliki metadata lengkap.");
        }

        return self::SUCCESS;
    }

    /**
     * Batch scrape semua memories yang belum punya metadata
     */
    private function batchScrape(): int
    {
        $query = Memory::query();

        if (!$this->option('all')) {
            // Hanya yang belum punya thumbnail atau embed code
            $query->where(function ($q) {
                $q->whereNull('thumbnail_url')
                    ->orWhereNull('embed_code')
                    ->orWhere('thumbnail_url', '')
                    ->orWhere('embed_code', '');
            });
        }

        $memories = $query->get();

        if ($memories->isEmpty()) {
            $this->info("Tidak ada memory yang perlu di-scrape.");
            return self::SUCCESS;
        }

        $this->info("Memproses {$memories->count()} memories...");
        $bar = $this->output->createProgressBar($memories->count());
        $bar->start();

        $updated = 0;
        $failed = 0;

        foreach ($memories as $memory) {
            try {
                $metadata = $this->scraper->scrape($memory->source_url);

                $changes = false;

                if (!empty($metadata['thumbnail_url']) && empty($memory->thumbnail_url)) {
                    $memory->thumbnail_url = $metadata['thumbnail_url'];
                    $changes = true;
                }

                if (!empty($metadata['embed_code']) && empty($memory->embed_code)) {
                    $memory->embed_code = $metadata['embed_code'];
                    $changes = true;
                }

                if (!empty($metadata['title']) && empty($memory->title)) {
                    $memory->title = $metadata['title'];
                    $changes = true;
                }

                if ($changes) {
                    $memory->save();
                    $updated++;
                }
            } catch (\Exception $e) {
                $failed++;
                $this->newLine();
                $this->warn("  Gagal scrape #{$memory->id}: " . $e->getMessage());
            }

            $bar->advance();

            // Rate limiting - jangan terlalu cepat
            usleep(500000); // 0.5 detik delay
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Selesai! Updated: {$updated}, Gagal: {$failed}");

        return self::SUCCESS;
    }
}
