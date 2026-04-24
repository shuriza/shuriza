

<?php $__env->startSection('content'); ?>
<h1>Rekap Absensi Bulanan: <?php echo e($month); ?>/<?php echo e($year); ?></h1>

<form class="mb-4" action="<?php echo e(route('recap')); ?>" method="get">
  <select name="year">
    <?php $__currentLoopData = range(now()->year-5, now()->year); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $y): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <option value="<?php echo e($y); ?>" <?php echo e($y==$year?'selected':''); ?>><?php echo e($y); ?></option>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </select>
  <select name="month">
    <?php $__currentLoopData = $months = [
      1=>'Jan',2=>'Feb',3=>'Mar',4=>'Apr',
      5=>'May',6=>'Jun',7=>'Jul',8=>'Aug',
      9=>'Sep',10=>'Oct',11=>'Nov',12=>'Dec'
    ]; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $num => $name): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <option value="<?php echo e($num); ?>" <?php echo e($num==$month?'selected':''); ?>><?php echo e($name); ?></option>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </select>
  <button type="submit">Tampilkan</button>
</form>

<table id="tbl" class="display">
  <thead>
    <tr>
      <th>No</th>
      <th>Nama</th>
      <th>Tanggal</th>
      <th>Jam Masuk</th>
      <th>Jam Keluar</th>
      <th>Total Jam</th>
    </tr>
  </thead>
  <tbody>
    <?php $__currentLoopData = $recaps; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $i => $r): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
      <tr>
        <td><?php echo e($i+1); ?></td>
        <td><?php echo e($employees[$r->employee_id]); ?></td>
        <td><?php echo e($r->date); ?></td>
        <td><?php echo e($r->first_in); ?></td>
        <td><?php echo e($r->last_out); ?></td>
        <td><?php echo e($r->total_time); ?></td>
      </tr>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
  </tbody>
</table>

<script>
  $(function(){
    $('#tbl').DataTable({
      order: [[1,'asc'],[2,'asc']]
    });
  });
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\shuriza\absensi\resources\views/attendance/recap.blade.php ENDPATH**/ ?>