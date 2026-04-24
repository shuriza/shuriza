<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title><?php echo $__env->yieldContent('title', 'Absensi'); ?></title>
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
  <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css','resources/js/app.js']); ?>
</head>
<body>
  <div class="container mx-auto p-4">
    <?php echo $__env->yieldContent('content'); ?>
  </div>
</body>
</html>
<?php /**PATH C:\shuriza\absensi\resources\views/layout.blade.php ENDPATH**/ ?>