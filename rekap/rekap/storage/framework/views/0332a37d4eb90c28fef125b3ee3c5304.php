

<?php $__env->startSection('title', 'Kelola Akun Admin'); ?>

<?php $__env->startSection('content'); ?>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <?php if(session('success')): ?>
      <div class="bg-green-100 text-green-800 p-2 mb-4 rounded">
        <?php echo e(session('success')); ?>

      </div>
    <?php endif; ?>

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Daftar Admin</h1>
      <a href="<?php echo e(route('admin.admin.create')); ?>"
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Tambah Admin Baru
      </a>
    </div>

    <table class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2">NO</th>
          <th class="border px-4 py-2">Username</th>
          <th class="border px-4 py-2">Email</th>
          <th class="border px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <?php $__empty_1 = true; $__currentLoopData = $admins; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $i => $admin): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
          <tr>
            <td class="border px-4 py-2"><?php echo e($admins->firstItem() + $i); ?></td>
            <td class="border px-4 py-2"><?php echo e($admin->username); ?></td>
            <td class="border px-4 py-2"><?php echo e($admin->email); ?></td>
            <td class="border px-4 py-2 space-x-2">
              <a href="<?php echo e(route('admin.admin.edit', $admin->id_user)); ?>"
                class="text-blue-600 hover:underline">
                Edit
              </a>
              <form action="<?php echo e(route('admin.admin.destroy', $admin->id_user)); ?>" method="POST"
                class="inline" onsubmit="return confirm('Yakin ingin menghapus akun ini?')">
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
            <td colspan="4" class="border px-4 py-2 text-center">Belum ada akun.</td>
          </tr>
        <?php endif; ?>
      </tbody>
    </table>

    <div class="mt-4">
      <?php echo e($admins->links()); ?>

    </div>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/admin/admin.blade.php ENDPATH**/ ?>