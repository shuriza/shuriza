// Antrian Loket — indikator konektivitas & outbox.
// Vanilla JS saja: tanpa framework, tanpa dependensi.

function perbaruiIndikatorSinkron() {
    const indicator = document.getElementById('sync-indicator');
    if (!indicator) {
        return;
    }

    const dot = document.getElementById('sync-dot');
    const text = document.getElementById('sync-text');
    const pending = Number.parseInt(indicator.dataset.pending ?? '0', 10) || 0;
    const online = navigator.onLine;
    const configured = indicator.dataset.configured === 'true';

    const bagianPending = pending > 0 ? ` • ${pending} menunggu sinkron` : '';

    if (!configured) {
        text.textContent = `Lokal · pusat belum diatur${bagianPending}`;
        dot.className = 'inline-block h-2.5 w-2.5 rounded-full bg-slate-500';
        indicator.classList.remove('border-rose-700');
        indicator.classList.add('border-slate-700');
    } else if (online) {
        text.textContent = `Jaringan tersedia · pusat belum diperiksa${bagianPending}`;
        dot.className = 'inline-block h-2.5 w-2.5 rounded-full bg-emerald-400';
        indicator.classList.remove('border-rose-700');
        indicator.classList.add('border-slate-700');
    } else {
        text.textContent = `Jaringan terputus${bagianPending}`;
        dot.className = 'inline-block h-2.5 w-2.5 rounded-full bg-rose-500';
        indicator.classList.remove('border-slate-700');
        indicator.classList.add('border-rose-700');
    }
}

window.addEventListener('online', perbaruiIndikatorSinkron);
window.addEventListener('offline', perbaruiIndikatorSinkron);
document.addEventListener('DOMContentLoaded', perbaruiIndikatorSinkron);
