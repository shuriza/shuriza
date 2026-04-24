

<?php $__env->startSection('content'); ?>
  <div class="max-w-xl mx-auto mt-6 bg-white shadow p-6 rounded-lg">
    <h2 class="text-xl font-bold mb-4">Tambah Data Pangan & Harga</h2>

    <form action="<?php echo e(route('admin.bahan_pangan.store')); ?>" method="POST" enctype="multipart/form-data">
      <?php echo csrf_field(); ?>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Nama Pangan</label>
        <input type="text" name="nama_pangan" value="<?php echo e(old('nama_pangan')); ?>"
          class="w-full border-gray-300 rounded p-2">
        <?php $__errorArgs = ['nama_pangan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
          <div class="text-sm text-red-600"><?php echo e($message); ?></div>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Kategori</label>
        <select name="id_kriteria" class="w-full border-gray-300 rounded p-2">
          <?php $__currentLoopData = $kriteria_bahan; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <option value="<?php echo e($k->id_kriteria); ?>"
              <?php echo e(old('id_kriteria') == $k->id_kriteria ? 'selected' : ''); ?>>
              <?php echo e($k->nama_kriteria); ?>

            </option>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </select>
        <?php $__errorArgs = ['id_kriteria'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
          <div class="text-sm text-red-600"><?php echo e($message); ?></div>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Satuan</label>
        <input type="text" name="satuan" value="<?php echo e(old('satuan')); ?>"
          class="w-full border-gray-300 rounded p-2">
        <?php $__errorArgs = ['satuan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
          <div class="text-sm text-red-600"><?php echo e($message); ?></div>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Gambar (opsional)</label>
        <input type="file" name="image" accept="image/*"
          class="w-full border-gray-300 rounded p-2">
        <?php $__errorArgs = ['image'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
          <div class="text-sm text-red-600"><?php echo e($message); ?></div>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Harga</label>
        <input type="number" name="harga_pangan" value="<?php echo e(old('harga_pangan')); ?>"
          class="w-full border-gray-300 rounded p-2">
        <?php $__errorArgs = ['harga_pangan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
          <div class="text-sm text-red-600"><?php echo e($message); ?></div>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
      </div>

      <div class="mb-4">
        <label class="block font-semibold mb-1">Tanggal</label>
        <input type="date" name="tanggal" value="<?php echo e(old('tanggal')); ?>"
          class="w-full border-gray-300 rounded p-2">
        <?php $__errorArgs = ['tanggal'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
          <div class="text-sm text-red-600"><?php echo e($message); ?></div>
        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
      </div>

      <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Simpan
      </button>
    </form>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/admin/bahan_pangan_create.blade.php ENDPATH**/ ?>