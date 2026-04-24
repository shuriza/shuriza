

<?php $__env->startSection('content'); ?>
  <div class="bg-white p-6 rounded-lg shadow-md">

    
    <?php if(session('success')): ?>
      <div class="bg-green-100 text-green-800 p-2 mb-4 rounded">
        <?php echo e(session('success')); ?>

      </div>
    <?php endif; ?>

    
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Kelola Kriteria Bahan</h1>
      <a href="<?php echo e(route('admin.kriteria_bahan.create')); ?>"
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Tambah Kriteria Baru
      </a>
    </div>

    
    <table class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">Nama Kriteria</th>
          <th class="border px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php $__empty_1 = true; $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
          <tr>
            <td class="border px-4 py-2"><?php echo e($item->nama_kriteria); ?></td>
            <td class="border px-4 py-2 space-x-2">
              <a href="<?php echo e(route('admin.kriteria_bahan.edit', $item->id_kriteria)); ?>"
                class="text-blue-600 hover:underline">
                Edit
              </a>
              <form action="<?php echo e(route('admin.kriteria_bahan.destroy', $item->id_kriteria)); ?>"
                method="POST" class="inline" onsubmit="return confirm('Yakin ingin menghapus?')">
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
            <td colspan="2" class="border px-4 py-2 text-center text-gray-500">
              Tidak ada data ditemukan.
            </td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>

    
    <div class="mt-4">
      <?php echo e($data->links()); ?>

    </div>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/admin/kriteria_bahan.blade.php ENDPATH**/ ?>