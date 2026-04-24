<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Laporan Harga Pangan</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm;
    }

    body {
      /* Untuk DomPDF: pastikan body pake ukuran penuh */
      width: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    th,
    td {
      border: 1px solid #000;
      padding: 4px;
      text-align: center;
    }

    h3 {
      text-align: center;
    }
  </style>
</head>

<body>
  <h3>Laporan Harga Pangan<br>Periode <?php echo e($from); ?> &ndash; <?php echo e($to); ?></h3>
  <table>
    <thead>
      <tr>
        <th>Tanggal</th>
        <?php $__currentLoopData = $panganNames; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $nama): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
          <th><?php echo e($nama); ?></th>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
      </tr>
    </thead>
    <tbody>
      <?php $__currentLoopData = $rows; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <tr>
          <td><?php echo e($row['tanggal']); ?></td>
          <?php $__currentLoopData = $panganNames; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $nama): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <td><?php echo e($row['data'][$nama]); ?></td>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tr>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
  </table>
</body>

</html>
<?php /**PATH D:\laragon\www\dkpp\resources\views/admin/pdf.blade.php ENDPATH**/ ?>