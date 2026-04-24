<!DOCTYPE html>
<html lang="en">

<?php

use Carbon\Carbon;
?>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo e($web->web_deskripsi); ?>">
    <meta name="author" content="<?php echo e($web->web_nama); ?>">
    <meta name="keywords" content="">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>" />

    <title><?php echo e($title); ?></title>

    <style>
        * {
            font-family: Arial, Helvetica, sans-serif;
        }

        #table1 {
            border-collapse: collapse;
            width: 100%;
            margin-top: 32px;
        }

        #table1 td,
        #table1 th {
            border: 1px solid #ddd;
            padding: 8px;
        }

        #table1 th {
            padding-top: 12px;
            padding-bottom: 12px;
            color: black;
            font-size: 12px;
        }

        #table1 td {
            font-size: 11px;
        }

        .font-medium {
            font-weight: 500;
        }

        .font-bold {
            font-weight: 600;
        }

        .d-2 {
            display: flex;
            align-items: flex-start;
            margin-top: 32px;
        }
    </style>

</head>

<body>

    <center>
        <h1 class="font-medium">Laporan Barang Masuk</h1>
        <?php if($tglawal == ''): ?>
        <h4 class="font-medium">Semua Tanggal</h4>
        <?php else: ?>
        <h4 class="font-medium"><?php echo e(Carbon::parse($tglawal)->translatedFormat('d F Y')); ?> - <?php echo e(Carbon::parse($tglakhir)->translatedFormat('d F Y')); ?></h4>
        <?php endif; ?>
    </center>


    <table border="1" id="table1">
        <thead>
            <tr>
                <th align="center" width="1%">NO</th>
                <th>TGL MASUK</th>
                <th>KODE BRG MASUK</th>
                <th>KODE BARANG</th>
                <th>CUSTOMER</th>
                <th>BARANG</th>
                <th>JML MASUK</th>
            </tr>
        </thead>
        <tbody>
            <?php $no=1; ?>
            <?php $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $d): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td align="center"><?php echo e($no++); ?></td>
                <td><?php echo e(Carbon::parse($d->bm_tanggal)->translatedFormat('d F Y')); ?></td>
                <td><?php echo e($d->bm_kode); ?></td>
                <td><?php echo e($d->barang_kode); ?></td>
                <td><?php echo e($d->customer_nama); ?></td>
                <td><?php echo e($d->barang_nama); ?></td>
                <td align="center"><?php echo e($d->bm_jumlah); ?></td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>

</body>

</html><?php /**PATH /Users/willyap/Sites/wordpress/Sistem-Persediaan-Laravel/resources/views/Admin/Laporan/BarangMasuk/pdf.blade.php ENDPATH**/ ?>