


<?php $__env->startSection('title', 'Harga Pangan'); ?>

<?php $__env->startSection('content'); ?>
  <div class="bg-white p-6 rounded-lg shadow-md">

    
    <?php if(session('success')): ?>
      <div class="bg-green-100 text-green-800 p-2 mb-4 rounded">
        <?php echo e(session('success')); ?>

      </div>
    <?php endif; ?>

    
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Daftar Harga Pangan</h1>
      <a href="<?php echo e(route('admin.bahan_pangan.create')); ?>"
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Tambah Pangan Baru
      </a>
    </div>

    
    <form method="GET" class="flex gap-3 mb-6">
      <input type="text" name="search" value="<?php echo e(request('search')); ?>" placeholder="Cari Pangan..."
        class="flex-1 min-w-[200px] px-4 py-2 border rounded-lg text-sm focus:ring focus:ring-blue-200">
      
      <button type="submit"
        class="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 transition">
        CARI
      </button>
    </form>

    
    <table class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">Gambar</th>
          <th class="border px-4 py-2">Tanggal</th>
          <th class="border px-4 py-2">Nama Pangan</th>
          <th class="border px-4 py-2">Kategori</th>
          <th class="border px-4 py-2">Harga</th>
          <th class="border px-4 py-2">Satuan</th>
          <th class="border px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php $__empty_1 = true; $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
          <tr>
            <td class="border px-4 py-2">
              <?php if($item->pangan->image): ?>
                <img src="<?php echo e(asset('storage/' . $item->pangan->image)); ?>"
                  class="w-12 h-12 object-cover rounded" alt="">
              <?php else: ?>
                <div class="w-12 h-12 bg-gray-200 rounded"></div>
              <?php endif; ?>
            </td>
            <td class="border px-4 py-2"><?php echo e(\Carbon\Carbon::parse($item->tanggal)->format('d M Y')); ?>

            </td>
            <td class="border px-4 py-2"><?php echo e($item->pangan->nama_pangan); ?></td>
            <td class="border px-4 py-2"><?php echo e($item->pangan->kriteria_bahan->nama_kriteria); ?></td>
            <td class="border px-4 py-2">Rp <?php echo e(number_format($item->harga_pangan, 0, ',', '.')); ?></td>
            <td class="border px-4 py-2"><?php echo e($item->pangan->satuan); ?></td>
            <td class="border px-4 py-2 space-x-2">
              <a href="<?php echo e(route('admin.bahan_pangan.edit', $item->id_harga_pangan)); ?>"
                class="text-blue-600 hover:underline">
                Edit
              </a>
              <form action="<?php echo e(route('admin.bahan_pangan.destroy', $item->id_harga_pangan)); ?>"
                method="POST" class="inline"
                onsubmit="return confirm('Yakin ingin menghapus data ini?')">
                <?php echo csrf_field(); ?>
                <?php echo method_field('DELETE'); ?>
                <button type="submit" class="text-red-600 hover:underline">
                  Hapus
                </button>
              </form>
            </td>
          </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
          <tr>
            <td colspan="7" class="border px-4 py-2 text-center text-gray-500">
              Tidak ada data ditemukan.
            </td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>

    
    <div class="mt-4">
      <?php echo e($data->withQueryString()->links()); ?>

    </div>

  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/admin/bahan_pangan.blade.php ENDPATH**/ ?>