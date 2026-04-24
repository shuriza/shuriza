

<?php $__env->startSection('content'); ?>
<h1>Upload Attendance File</h1>
<form action="<?php echo e(route('import')); ?>" method="post" enctype="multipart/form-data">
  <?php echo csrf_field(); ?>
  <input type="file" name="file" accept=".xlsx" required>

  <select name="year">
    <?php $__currentLoopData = $years; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $y): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <option value="<?php echo e($y); ?>"><?php echo e($y); ?></option>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </select>

  <select name="month">
    <?php $__currentLoopData = $months; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $num => $name): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <option value="<?php echo e($num); ?>"><?php echo e($name); ?></option>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </select>

  <button type="submit">Upload & Process</button>
</form>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\shuriza\absensi\resources\views/attendance/upload.blade.php ENDPATH**/ ?>