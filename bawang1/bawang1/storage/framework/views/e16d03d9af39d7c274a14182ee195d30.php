<?php $__env->startSection('title', 'Dashboard'); ?>

<?php $__env->startSection('content'); ?>

<?php if($success = Session::get('success')): ?>
<script>
    const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

    Toast.fire({
    icon: "success",
    title: "<?php echo e($success); ?>"
    });
</script>
<?php endif; ?>

<div class="container">
    <div class="row">
        <?php if(Auth::user()->role_id == 1): ?>

        <div class="col-lg-4 col-md-6 col-sm-6 col-12">
            <div class="card card-statistic-1">
                <div class="card-icon bg-success">
                    <i class="bi bi-person-fill fa-2x text-white"></i>
                </div>
                <div class="card-wrap">
                    <div class="card-header">
                        <h4>Total Order Hari Ini</h4>
                    </div>
                    <div class="card-body">
                        <?php echo e($total_order_hari_ini); ?>

                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-6 col-12">
            <div class="card card-statistic-1">
                <div class="card-icon bg-dark">
                    <i class="bi bi-cash fa-2x text-white"></i>
                </div>
                <div class="card-wrap">
                    <div class="card-header">
                        <h4>Total Penjualan Hari Ini</h4>
                    </div>
                    <div class="card-body">
                        <?php echo e($total_penjualan_hari_ini); ?>

                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-6 col-12">
            <div class="card card-statistic-1">
                <div class="card-icon bg-danger">
                    <i class="bi bi-basket-fill fa-2x text-white"></i>
                </div>
                <div class="card-wrap">
                    <div class="card-header">
                        <h4>Total Barang Terjual Hari Ini</h4>
                    </div>
                    <div class="card-body">
                        <?php echo e($total_barang_terjual_hari_ini); ?>

                    </div>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>

    <?php if(Auth::user()->role_id == 1): ?>
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4>Daftar Nama Order Hari Ini</h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped" id="table-1">
                            <thead>
                                <tr>
                                    <th class="text-center">
                                        No
                                    </th>
                                    <th>Nama Customer</th>
                                    <th>Invoice</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $no = 1;
                                ?>

                                <?php $__currentLoopData = $nama_order_hari_ini; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <?php $__currentLoopData = $user->order_details; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $order): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr>
                                    <td><?php echo e($no++); ?></td>
                                    <td><?php echo e($user->name); ?></td>
                                    <td><?php echo e($order->order_id); ?></td>
                                    <td><?php echo e(ucfirst($order->status)); ?></td>
                                </tr>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>
</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/dashboard/index.blade.php ENDPATH**/ ?>