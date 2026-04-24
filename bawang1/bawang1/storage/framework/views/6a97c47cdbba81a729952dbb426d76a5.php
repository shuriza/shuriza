<?php $__env->startSection('title', 'Bukti Pembayaran'); ?>

<?php $__env->startSection('content'); ?>

<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h4>Bukti Pembayaran <?php echo e(Auth::user()->role_id == 2 ? "Anda" : ""); ?></h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped" id="table-1">
                        <thead>
                            <tr>

                                <?php if(Auth::user()->role_id == 2): ?>
                                <th class="text-center">
                                    No
                                </th>
                                <th class="text-center">Produk</th>
                                <th class="text-center">Invoice</th>
                                <th class="text-center">Status</th>
                                <th class="text-center">Aksi</th>
                                <?php endif; ?>

                            </tr>
                        </thead>

                        <tbody>
                            <?php
                            $no = 1;
                            ?>

                            <?php if(Auth::user()->role_id == 2): ?>

                            <?php $__currentLoopData = $produk; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $data): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php $__currentLoopData = $data->produk_beli; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                            <tr class="text-center">
                                <td>
                                    <?php echo e($no++); ?>

                                </td>
                                <td><?php echo e($data->nama); ?></td>
                                <td><?php echo e($item->order_id); ?></td>
                                <td><?php echo e(ucfirst($item->status)); ?></td>
                                <td class="d-flex justify-content-center">

                                    <?php if($item->status == 'pending' || $item->status == 'deny'): ?>
                                    <a href="<?php echo e(route('metode_pembayaran', $item->order_id)); ?>"
                                        class="btn btn-danger"><i class="bi bi-credit-card-fill mx-1"></i>Selesaikan
                                        Pembayaran
                                    </a>

                                    <?php elseif($item->status == 'success'): ?>
                                    <a href="<?php echo e(route('download_bukti_pembayaran', $item->order_id)); ?>"
                                        class="btn btn-success"><i class="bi bi-file-pdf-fill mx-1"></i>Unduh
                                        Bukti</a>
                                    <?php endif; ?>
                                </td>
                            </tr>

                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/pembayaran/bukti_pembayaran.blade.php ENDPATH**/ ?>