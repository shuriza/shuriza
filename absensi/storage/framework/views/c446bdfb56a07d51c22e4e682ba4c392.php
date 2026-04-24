

<?php $__env->startSection('content'); ?>
<h1>All Attendance Records</h1>
<table id="tbl">
  <thead>
    <tr><th>ID</th><th>Name</th><th>Date</th><th>Time</th></tr>
  </thead>
  <tbody>
    <?php $__currentLoopData = $records; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $r): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <tr>
      <td><?php echo e($r->id); ?></td>
      <td><?php echo e($r->employee->name); ?></td>
      <td><?php echo e($r->date); ?></td>
      <td><?php echo e($r->time); ?></td>
    </tr>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </tbody>
</table>

<script>
  $(document).ready(function(){
    $('#tbl').DataTable();
  });
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\shuriza\absensi\resources\views/attendance/index.blade.php ENDPATH**/ ?>