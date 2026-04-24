
<?php $__env->startSection('title', 'Laporan Harga Pangan'); ?>

<?php $__env->startSection('content'); ?>
  <div class="p-6 bg-white rounded shadow-md max-w-lg mx-auto mt-12">
    <h1 class="text-2xl font-semibold mb-4">Unduh Laporan Harga Pangan</h1>

    <?php if($errors->any()): ?>
      <div class="bg-red-100 text-red-700 p-2 mb-4 rounded">
        <ul class="list-disc list-inside">
          <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $e): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li><?php echo e($e); ?></li>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>
      </div>
    <?php endif; ?>

    <form action="<?php echo e(route('admin.laporan.export')); ?>" method="GET">
      <div class="mb-4">
        <label for="from" class="block font-medium">Dari Tanggal</label>
        <input type="date" name="from" id="from" value="<?php echo e(old('from', request('from'))); ?>"
          class="border p-2 w-full" required>
      </div>
      <div class="mb-4">
        <label for="to" class="block font-medium">Sampai Tanggal</label>
        <input type="date" name="to" id="to" value="<?php echo e(old('to', request('to'))); ?>"
          class="border p-2 w-full" required>
      </div>
      <div class="mb-4">
        <span class="block font-medium mb-2">Format File</span>
        <label class="inline-flex items-center mr-4">
          <input type="radio" name="format" value="excel"
            <?php echo e(request('format') == 'excel' ? 'checked' : ''); ?> required>
          <span class="ml-2">Excel</span>
        </label>
        <label class="inline-flex items-center">
          <input type="radio" name="format" value="pdf"
            <?php echo e(request('format') == 'pdf' ? 'checked' : ''); ?>>
          <span class="ml-2">PDF</span>
        </label>
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Unduh
      </button>
    </form>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/admin/laporan.blade.php ENDPATH**/ ?>