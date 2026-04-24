

<?php $__env->startSection('content'); ?>
  <div class="max-w-4xl mx-auto mt-10 space-y-6">
    
    <div class="bg-white p-6 rounded-xl shadow border">
      <h2 class="text-xl font-bold mb-4">📤 Upload File Excel Absensi</h2>

      
      <?php if(session('success')): ?>
        <div class="bg-green-100 text-green-700 p-3 rounded mb-4">
          <?php echo e(session('success')); ?>

        </div>
      <?php endif; ?>

      
      <?php if($errors->any()): ?>
        <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
          <ul class="list-disc ml-5">
            <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <li><?php echo e($error); ?></li>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </ul>
        </div>
      <?php endif; ?>

      
      <form method="POST" action="<?php echo e(route('absensi.preview')); ?>" enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <input type="file" name="file_excel[]" multiple required
          class="border p-2 rounded w-full mb-4">
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Preview Data
        </button>
      </form>
    </div>

    
    <?php if(!empty($preview)): ?>
      <div class="bg-white p-6 rounded-xl shadow border">
        <h2 class="text-xl font-bold mb-4">📄 Preview Data Absensi</h2>
        <p class="text-sm text-gray-600 mb-2">Menampilkan <?php echo e(count($preview)); ?> data absensi.</p>

        <form method="POST" action="<?php echo e(route('absensi.store')); ?>">
          <?php echo csrf_field(); ?>
          <table class="w-full text-sm border mb-4">
            <thead class="bg-gray-100">
              <tr>
                <th class="border px-2 py-1">Nama</th>
                <th class="border px-2 py-1">Departemen</th>
                <th class="border px-2 py-1">Tanggal</th>
                <th class="border px-2 py-1">Jam Masuk</th>
                <th class="border px-2 py-1">Jam Pulang</th>
              </tr>
            </thead>
            <tbody>
              <?php $__currentLoopData = $preview; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $i => $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                  <?php $__currentLoopData = ['nama', 'departemen', 'tanggal', 'jam_masuk', 'jam_pulang']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <td class="border px-2 py-1">
                      <input type="hidden" name="data[<?php echo e($i); ?>][<?php echo e($key); ?>]"
                        value="<?php echo e($row[$key]); ?>">
                      <?php echo e($row[$key]); ?>

                    </td>
                  <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tr>
              <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
          </table>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Simpan ke Database
          </button>
        </form>
      </div>
    <?php elseif(isset($preview)): ?>
      
      <div class="bg-white p-6 rounded-xl shadow border text-gray-500 italic">
        Tidak ada data absensi yang bisa ditampilkan.
      </div>
    <?php endif; ?>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\rekap\resources\views/absensi/index.blade.php ENDPATH**/ ?>