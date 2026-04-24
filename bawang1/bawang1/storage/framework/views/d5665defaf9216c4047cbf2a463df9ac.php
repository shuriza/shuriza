<?php $__env->startSection('title', 'Produk Terjual'); ?>

<?php $__env->startSection('content'); ?>

<div class="container">

    <div class="row">
        <div class="col-12">
            <div class="card">

                <div class="ml-4">
                    <div class="row mt-3">
                        <div class="col">
                            <h5 class="text-primary">Produk Terjual</h5>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped text-center" id="table-1">
                            <thead>
                                <tr>
                                    <th>
                                        No
                                    </th>
                                    <th>Nama Produk</th>
                                    <th>Deskripsi Produk</th>
                                    <th>Terjual</th>
                                </tr>
                            </thead>

                            <tbody>

                                <?php $no = 1; ?>
                                <?php $__currentLoopData = $produk; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr class="text-center">

                                    <td><?php echo e($no++); ?></td>
                                    <td><?php echo e($item->nama); ?></td>
                                    <td><?php echo e($item->deskripsi); ?></td>
                                    <td><?php echo e($item->produk_terjual_sum_jumlah_terjual); ?></td>

                                </tr>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/produk/produk_terjual.blade.php ENDPATH**/ ?>