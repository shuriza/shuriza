<?php $__env->startSection('title', 'Menu Produk'); ?>

<?php $__env->startSection('content'); ?>

<div class="container">

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

    <?php elseif($error = Session::get('error')): ?>
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
        icon: "error",
        title: "<?php echo e($error); ?>"
        });
    </script>
    <?php endif; ?>

    <div class="row">
        <div class="col-12">
            <div class="card">

                <div class="ml-4">
                    <div class="row mt-3">
                        <div class="col">
                            <h5 class="text-primary">Menu Produk</h5>
                        </div>
                    </div>

                    <?php if(Auth::user()->role_id == 1): ?>
                    <div class="row mt-3">
                        <div class="col">
                            <a href="<?php echo e(route('menu_produk.create')); ?>" class="btn btn-success mb-3"><i
                                    class="bi bi-plus-circle-fill"></i> Tambah</a>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>

                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped text-center" id="table-1">
                            <thead>
                                <tr>
                                    <th>
                                        No
                                    </th>
                                    <th>Nama</th>
                                    <th>Deskripsi</th>
                                    <th>Harga</th>
                                    <th>Status</th>
                                    <th>Tanggal Buat</th>
                                    <th>Tanggal Ubah</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>

                                <?php
                                $no = 1;
                                ?>

                                <?php $__currentLoopData = (Auth::user()->role_id == 1 ? $semuaProduk : $produkCustomer); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>

                                <tr>
                                    <td>
                                        <?php echo e($no++); ?>

                                    </td>
                                    <td><?php echo e((Auth::user()->role_id == 1 ? $item->nama : $item->nama_produk)); ?></td>
                                    <td><?php echo e((Auth::user()->role_id == 1 ? $item->deskripsi : $item->deskripsi_produk)); ?>

                                    </td>
                                    <td>Rp <?php echo e(number_format(Auth::user()->role_id == 1 ? $item->harga :
                                        $item->harga_produk, 0, ',', '.')); ?></td>
                                    <td>

                                        <?php if(Auth::user()->role_id == 1): ?>
                                        <span
                                            class="<?php echo e($item->status == 'tersedia' ? 'badge badge-success' : ($item->status == 'masih dalam pengembangan' ? 'badge badge-warning' : 'badge badge-danger')); ?>">
                                            <?php echo e($item->status == 'tersedia' ? ucfirst($item->status) :
                                            ($item->status == 'masih dalam pengembangan' ? 'Dalam Pengembangan' :
                                            'Tidak
                                            Tersedia')); ?>

                                        </span>

                                        <?php else: ?>
                                        <span
                                            class="<?php echo e($item->status_produk == 'tersedia' ? 'badge badge-success' : ($item->status_produk == 'masih dalam pengembangan' ? 'badge badge-warning' : 'badge badge-danger')); ?>">
                                            <?php echo e($item->status_produk == 'tersedia' ? ucfirst($item->status_produk) :
                                            ($item->status_produk == 'masih dalam pengembangan' ? 'Dalam Pengembangan' :
                                            'Tidak
                                            Tersedia')); ?>

                                        </span>
                                        <?php endif; ?>
                                    </td>

                                    <td><?php echo e((Auth::user()->role_id == 1 ? $item->created_at : $item->tanggal_buat)); ?>

                                    </td>
                                    <td><?php echo e((Auth::user()->role_id == 1 ? $item->updated_at : $item->tanggal_ubah)); ?>

                                    </td>
                                    <td>
                                        <?php if(Auth::user()->role_id == 1): ?>
                                        <div class="row">
                                            <div class="col">
                                                <a href="<?php echo e(route('menu_produk.edit', $item->id)); ?>"
                                                    class="btn btn-warning text-white mb-2"><i
                                                        class="bi bi-pen-fill"></i>
                                                    Update</a>
                                            </div>
                                        </div>

                                        <div class="row mt-1 mb-1">
                                            <div class="col">
                                                <form action="<?php echo e(route('menu_produk.destroy', $item->id)); ?>"
                                                    method="post">
                                                    <?php echo csrf_field(); ?>
                                                    <?php echo method_field('DELETE'); ?>
                                                    <button type="submit" class="btn btn-danger mb-2"
                                                        onclick="return confirm('Apakah Anda yakin ingin menghapus produk ini?')"><i
                                                            class="bi bi-trash-fill"></i> Delete</button>
                                                </form>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col">
                                                <a href="<?php echo e(route('menu_produk.show', $item->id)); ?>"
                                                    class="btn btn-info text-white mb-2"><i class="bi bi-eye-fill"></i>
                                                    Lihat</a>
                                            </div>
                                        </div>

                                        <?php else: ?>
                                        <div class="row">

                                            <?php if($item->status_beli == 'pending' || $item->status_beli == 'deny'): ?>
                                            <div class="col">
                                                <a href="<?php echo e(route('metode_pembayaran', $item->order_id)); ?>"
                                                    class="btn btn-danger"><i
                                                        class="bi bi-credit-card-fill mx-1"></i>Selesaikan
                                                    Pembayaran
                                                </a>
                                            </div>

                                            <?php elseif($item->status_beli != 'success'): ?>
                                            <div class="col">
                                                <a href="<?php echo e(route('beli', $item->id_produk)); ?>"
                                                    class="btn btn-primary text-white mb-2"><i
                                                        class="bi bi-bag-fill"></i>
                                                    Beli</a>

                                                <a href="<?php echo e(route('menu_produk.show', $item->id_produk)); ?>"
                                                    class="btn btn-info text-white mb-2"><i class="bi bi-eye-fill"></i>
                                                    Lihat</a>
                                            </div>
                                            <?php endif; ?>

                                            <?php if($item->status_beli == 'success'): ?>
                                            <div class="col">
                                                <a href="<?php echo e(route('download_produk', $item->id_produk)); ?>"
                                                    class="btn btn-success text-white"><i class="bi bi-download"></i>
                                                    Unduh</a>
                                            </div>
                                            <?php endif; ?>
                                        </div>
                                        <?php endif; ?>
                                    </td>
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
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/produk/index.blade.php ENDPATH**/ ?>