


<?php $__env->startSection('content'); ?>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-semibold text-center mb-6 text-gray-700">Edit Bahan Pangan</h1>

    <?php if($errors->any()): ?>
      <div class="bg-red-100 text-red-700 p-4 mb-6 rounded-lg shadow-lg">
        <ul class="list-disc list-inside">
          <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li><?php echo e($error); ?></li>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>
      </div>
    <?php endif; ?>

    <div class="bg-white p-8 rounded-lg shadow-lg">
      <form action="<?php echo e(route('admin.bahan_pangan.update', $data->id_harga_pangan)); ?>" method="POST"
        enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <?php echo method_field('PUT'); ?>

        
        <input type="hidden" name="id_pangan" value="<?php echo e($data->pangan->id_pangan); ?>">

        
        <div class="mb-6">
          <label for="nama_pangan" class="block text-sm font-medium text-gray-600">Nama Pangan</label>
          <input type="text" name="nama_pangan" id="nama_pangan"
            value="<?php echo e(old('nama_pangan', $data->pangan->nama_pangan)); ?>"
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-400"
            required>
          <?php $__errorArgs = ['nama_pangan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
            <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
          <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
        </div>

        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-600">Gambar Saat Ini</label>
          <?php if($data->pangan->image): ?>
            <img src="<?php echo e(asset('storage/' . $data->pangan->image)); ?>"
              class="mt-2 w-32 h-20 object-cover rounded-lg" alt="<?php echo e($data->pangan->nama_pangan); ?>">
          <?php else: ?>
            <p class="mt-2 text-sm text-gray-500">Belum ada gambar.</p>
          <?php endif; ?>
        </div>

        
        <div class="mb-6">
          <label for="image" class="block text-sm font-medium text-gray-600">Ganti Gambar
            (opsional)</label>
          <input type="file" name="image" id="image" accept="image/*"
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg">
          <?php $__errorArgs = ['image'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
            <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
          <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
        </div>

        
        <div class="mb-6">
          <label for="satuan" class="block text-sm font-medium text-gray-600">Satuan</label>
          <input type="text" name="satuan" id="satuan"
            value="<?php echo e(old('satuan', $data->pangan->satuan)); ?>"
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required>
          <?php $__errorArgs = ['satuan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
            <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
          <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
        </div>

        
        <div class="mb-6">
          <label for="id_kriteria" class="block text-sm font-medium text-gray-600">Kategori</label>
          <select name="id_kriteria" id="id_kriteria"
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required>
            <?php $__currentLoopData = $kriteria_bahan; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <option value="<?php echo e($k->id_kriteria); ?>"
                <?php echo e(old('id_kriteria', $data->pangan->id_kriteria) == $k->id_kriteria ? 'selected' : ''); ?>>
                <?php echo e($k->nama_kriteria); ?>

              </option>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </select>
          <?php $__errorArgs = ['id_kriteria'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
            <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
          <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
        </div>

        
        <div class="mb-6">
          <label for="harga_pangan" class="block text-sm font-medium text-gray-600">Harga
            Pangan</label>
          <input type="number" step="0.01" name="harga_pangan" id="harga_pangan"
            value="<?php echo e(old('harga_pangan', $data->harga_pangan)); ?>"
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required>
          <?php $__errorArgs = ['harga_pangan'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
            <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
          <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
        </div>

        
        <div class="mb-6">
          <label for="tanggal" class="block text-sm font-medium text-gray-600">Tanggal</label>
          <input type="date" name="tanggal" id="tanggal"
            value="<?php echo e(old('tanggal', $data->tanggal)); ?>"
            class="mt-2 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required>
          <?php $__errorArgs = ['tanggal'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
            <p class="mt-1 text-sm text-red-600"><?php echo e($message); ?></p>
          <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
        </div>

        
        <div class="flex justify-center">
          <button type="submit"
            class="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition transform hover:scale-105">
            Update Data
          </button>
        </div>
      </form>
    </div>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/admin/bahan_pangan_edit.blade.php ENDPATH**/ ?>