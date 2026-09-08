<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tiket {{ $ticket->label }}</title>
    <style>
        /* Struk thermal 58mm — mandiri tanpa aset eksternal. */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: "Courier New", ui-monospace, monospace;
            background: #e2e8f0;
            color: #0f172a;
            padding: 16px;
        }

        .receipt {
            width: 58mm;
            max-width: 100%;
            margin: 0 auto;
            background: #ffffff;
            padding: 12px 10px;
            box-shadow: 0 1px 4px rgba(15, 23, 42, 0.25);
            text-align: center;
        }

        .office-name {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .office-address {
            font-size: 10px;
            margin-top: 2px;
        }

        .divider {
            border-top: 1px dashed #0f172a;
            margin: 8px 0;
        }

        .service-name {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .ticket-label {
            font-size: 44px;
            font-weight: 900;
            letter-spacing: 1px;
            line-height: 1.1;
            margin: 6px 0;
        }

        .meta {
            font-size: 11px;
            line-height: 1.5;
            text-align: left;
        }

        .meta .row {
            display: flex;
            justify-content: space-between;
        }

        .footer-note {
            font-size: 10px;
            margin-top: 8px;
            line-height: 1.4;
        }

        .flash {
            max-width: 58mm;
            margin: 0 auto 12px;
            padding: 8px 10px;
            font-size: 11px;
            border-radius: 4px;
        }

        .flash.status { background: #d1fae5; border: 1px solid #10b981; }
        .flash.error { background: #ffe4e6; border: 1px solid #f43f5e; }

        .actions {
            max-width: 58mm;
            margin: 12px auto 0;
            display: flex;
            gap: 8px;
        }

        .actions form { flex: 1; }

        .actions button, .actions a {
            display: block;
            width: 100%;
            padding: 10px 6px;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            border: 0;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
        }

        .btn-print { background: #059669; color: #ffffff; }
        .btn-browser { background: #334155; color: #ffffff; }
        .btn-back { background: #cbd5e1; color: #0f172a; }

        @media print {
            body { background: #ffffff; padding: 0; }
            .receipt { box-shadow: none; width: 58mm; margin: 0; }
            .actions, .flash { display: none !important; }
        }
    </style>
</head>
<body>
    @if (session('status'))
        <div class="flash status">{{ session('status') }}</div>
    @endif

    @if (session('error'))
        <div class="flash error">{{ session('error') }}</div>
    @endif

    <div class="receipt">
        <div class="office-name">{{ $officeName }}</div>
        <div class="office-address">{{ $officeAddress }}</div>

        <div class="divider"></div>

        <div class="service-name">{{ $ticket->service->name }}</div>
        <div class="ticket-label">{{ $ticket->label }}</div>

        <div class="divider"></div>

        <div class="meta">
            <div class="row">
                <span>Tanggal</span>
                <span>{{ $ticket->service_date?->format('d/m/Y') }}</span>
            </div>
            <div class="row">
                <span>Diambil</span>
                <span>{{ $ticket->issued_at?->format('H:i:s') }}</span>
            </div>
            <div class="row">
                <span>Antrian di depan</span>
                <span>{{ $queueAhead }} orang</span>
            </div>
        </div>

        <div class="divider"></div>

        <div class="footer-note">
            Mohon tunggu hingga nomor Anda dipanggil.<br>
            Simpan tiket ini sampai layanan selesai.<br>
            Terima kasih.
        </div>
    </div>

    <div class="actions">
        {{-- Kirim ke printer lokal via NativePHP (POST, bukan GET). --}}
        <form method="POST" action="{{ route('tiket.cetak.kirim', $ticket) }}">
            @csrf
            <button type="submit" class="btn-print">Cetak ke Printer</button>
        </form>

        <button type="button" class="btn-browser" onclick="window.print()">Cetak di Browser</button>

        <a href="{{ route('loket.index') }}" class="btn-back">Kembali</a>
    </div>
</body>
</html>
