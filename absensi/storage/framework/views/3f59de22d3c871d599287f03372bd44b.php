

<?php $__env->startSection('content'); ?>
<div class="alert alert-success">File uploaded successfully!</div>
<div><strong>Total Records:</strong> <?php echo e($total); ?></div>
<div><strong>Month/Year:</strong> <?php echo e($request->month); ?>/<?php echo e($request->year); ?></div>

<table>
  <tr><th>Name</th><th>Date</th><th>Time</th><th>Datetime</th></tr>
  <?php $__currentLoopData = $samples; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $r): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
  <tr>
    <td><?php echo e($r->employee->name); ?></td>
    <td><?php echo e($r->date); ?></td>
    <td><?php echo e($r->time); ?></td>
    <td><?php echo e($r->datetime); ?></td>
  </tr>
  <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</table>

<p><a href="<?php echo e(route('records')); ?>">Lihat semua data</a></p>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\shuriza\absensi\resources\views/attendance/success.blade.php ENDPATH**/ ?>