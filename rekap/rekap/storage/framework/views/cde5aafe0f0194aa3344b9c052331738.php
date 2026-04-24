


<?php $__env->startSection('title', 'Harga Pangan'); ?>

<?php
  use Illuminate\Support\Facades\DB;
  use Carbon\Carbon;
?>

<?php $__env->startSection('content'); ?>
  <div class="p-6 max-w-7xl mx-auto space-y-6">

    
    <form id="filter-form" method="GET"
      class="flex flex-col lg:flex-row lg:flex-row-reverse lg:justify-between lg:items-center lg:space-x-4 space-y-3 lg:space-y-0 mb-6">
      <div class="flex space-x-2">
        <button type="submit"
          class="px-6 py-2 ml-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Apply
        </button>
      </div>
      <input type="text" name="search" value="<?php echo e($search); ?>" placeholder="Cari Komoditas..."
        class="flex-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200">
    </form>

    
    <div class="flex items-center text-sm text-gray-600 space-x-6">
      <span class="flex items-center">
        <svg class="h-4 w-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 10l4-4 4 4H5z" />
        </svg>
        Harga Turun
      </span>
      <span class="flex items-center">
        <svg class="h-4 w-4 text-red-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 10l4 4 4-4H5z" />
        </svg>
        Harga Naik
      </span>
      <span class="flex items-center">
        <svg class="h-4 w-4 text-gray-600 mr-1" fill="none" stroke="currentColor"
          viewBox="0 0 20 20">
          <path stroke-linecap="round" stroke-width="2" d="M4 10h12" />
        </svg>
        Harga Tetap
      </span>
    </div>
    <p class="text-gray-600">bahan di kategorikan menurut kandungan terbanyak</p>

    
    <div class="flex flex-wrap gap-3 mb-4">
      <a href="<?php echo e(route('harga_pangan')); ?>"
        class="px-4 py-2 rounded-full border <?php echo e(!$category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'); ?>">
        Semua
      </a>
      <?php $__currentLoopData = $categories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cat): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <a href="<?php echo e(route('harga_pangan', array_merge(request()->all(), ['category' => $cat->id_kriteria]))); ?>"
          class="px-4 py-2 rounded-full border <?php echo e($category == $cat->id_kriteria ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'); ?>">
          <?php echo e($cat->nama_kriteria); ?>

        </a>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>

    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <?php $__empty_1 = true; $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
        <?php
          // 1) ambil history 6 harga terakhir (urut ascending)
          $history = DB::table('history_harga')
              ->where('id_pangan', $item->id_pangan)
              ->orderBy('tanggal_perubahan', 'asc')
              ->limit(6)
              ->pluck('harga_baru')
              ->toArray();

          // 2) harga sebelumnya (last history) atau fallback ke current
          $prevPrice = end($history) ?: $item->harga_pangan;

          // 3) gabungkan series (history + harga sekarang)
          $prices = array_merge($history, [$item->harga_pangan]);

          // 4) hitung delta & persentase
          $delta = $item->harga_pangan - $prevPrice;
          $pct = $prevPrice ? round(($delta / $prevPrice) * 100, 2) : 0;

          // 5) set warna sesuai arah
          $color = $delta < 0 ? '#48bb78' : ($delta > 0 ? '#f56565' : '#a0aec0');

          // 6) buat series persentase relatif
          $relativeSeries = array_map(function ($p) use ($prevPrice) {
              return round((($p - $prevPrice) / $prevPrice) * 100, 2);
          }, $prices);

          // 7) jadikan string untuk data-values
          $seriesString = implode(',', $relativeSeries);

          // 8) format tanggal
          $updated = Carbon::parse($item->tanggal)->locale('id')->isoFormat('DD MMMM YYYY');
        ?>

        <div
          class="bg-white rounded-lg shadow-md p-5 flex flex-col h-[400px] w-full hover:shadow-lg transition-shadow duration-300">

          
          <?php if($item->pangan->image): ?>
            <img src="<?php echo e(asset('storage/' . $item->pangan->image)); ?>"
              alt="<?php echo e($item->pangan->nama_pangan); ?>"
              class="h-36 w-full object-cover rounded-md mb-4 border border-gray-200" />
          <?php else: ?>
            <div class="h-36 w-full bg-gray-100 rounded-md mb-4 border border-gray-200"></div>
          <?php endif; ?>

          
          <h3 class="font-semibold text-xl text-gray-800 truncate mb-2">
            <?php echo e($item->pangan->nama_pangan); ?>

          </h3>

          
          <p class="text-gray-700 text-base mb-3 font-medium">
            Rp <?php echo e(number_format($item->harga_pangan, 0, ',', '.')); ?> / <?php echo e($item->pangan->satuan); ?>

          </p>

          
          <div class="flex justify-between mb-4">
            <span class="inline-flex items-center space-x-1 text-sm font-semibold">
              <span>
                <?php if($delta > 0): ?>
                  ↑
                <?php elseif($delta < 0): ?>
                  ↓
                <?php else: ?>
                  =
                <?php endif; ?>
              </span>
              <span><?php echo e(abs($pct)); ?>%</span>
              <small class="text-gray-400">(Rp <?php echo e(number_format(abs($delta), 0, ',', '.')); ?>)</small>
            </span>
            <span class="text-sm text-gray-600">
              Update terakhir:<br><?php echo e($updated); ?>

            </span>
          </div>

          
          <p class="text-gray-600 text-xs">Garfik pergerakan harga 7hari terakhir</p>
          <div class="pt-3 border-t border-gray-200 mt-auto">
            <canvas class="sparkline-chart mt-2 w-full" width="160" height="40"
              data-values="<?php echo e($seriesString); ?>" data-color="<?php echo e($color); ?>">
            </canvas>
          </div>
        </div>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
        <p class="col-span-full text-center text-gray-500">
          Tidak ada data untuk filter ini.
        </p>
      <?php endif; ?>
    </div>

    
    <div class="mt-6">
      <?php echo e($data->withQueryString()->links()); ?>

    </div>
  </div>

  
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('canvas.sparkline-chart').forEach(cnv => {
        const vals = (cnv.dataset.values || '')
          .split(',')
          .map(v => parseFloat(v))
          .filter(n => !isNaN(n));
        if (!vals.length) return;

        // padding y-axis agar spike tidak meratakan grafik
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        const pad = (max - min) * 0.1;

        new Chart(cnv.getContext('2d'), {
          type: 'line',
          data: {
            labels: vals.map((_, i) => i),
            datasets: [{
              data: vals,
              borderColor: cnv.dataset.color,
              borderWidth: 2,
              fill: false,
              pointRadius: 0,
              tension: 0.3
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
              x: {
                display: false
              },
              y: {
                display: false,
                min: min - pad,
                max: max + pad
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: false
              }
            },
            layout: {
              padding: 0
            }
          }
        });
      });
    });
  </script>

  
  <style>
    .sparkline-chart {
      display: inline-block;
      vertical-align: middle;
    }
  </style>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/guest/harga_pangan.blade.php ENDPATH**/ ?>