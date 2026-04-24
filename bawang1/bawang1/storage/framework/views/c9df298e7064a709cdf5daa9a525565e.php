<?php $__env->startSection('title', 'Menu Produk'); ?>

<?php $__env->startSection('content'); ?>

<div class="container mb-3">

    <?php if($error = Session::get('error')): ?>
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
                <div class="card-header">
                    <h4>Checkout</h4>
                </div>

                <div class="card-body">

                    <form method="post" action="<?php echo e(url('proses_checkout')); ?>">
                        <?php echo csrf_field(); ?>

                        <?php if($user->nomor_telepon == '' || $user->user->name == ''): ?>
                        <div class="alert alert-warning text-center" role="alert">
                            Lengkapi profile Anda untuk membeli suatu produk.
                        </div>
                        <?php endif; ?>

                        <input type="hidden" name="id" value="<?php echo e($produk->id); ?>">
                        <div class="form-group">
                            <label for="nama_produk">Nama Produk</label>
                            <input type="text" class="form-control" id="nama_produk" name="nama_produk"
                                autocomplete="off" value="<?php echo e($produk->nama); ?>" readonly>
                        </div>

                        <div class="form-group">
                            <label for="deskripsi">Deskripsi</label>
                            <input type="text" class="form-control" id="deskripsi" name="deskripsi" autocomplete="off"
                                value="<?php echo e($produk->deskripsi); ?>" readonly>
                        </div>

                        <div class="form-group">
                            <label for="qty">Qty</label>
                            <input type="text" class="form-control" id="qty" name="qty" autocomplete="off" value="1"
                                readonly>
                        </div>

                        <div class="form-group">
                            <label for="harga">Harga</label>
                            <input type="text" class="form-control" id="harga" name="harga" autocomplete="off"
                                value="<?php echo e(number_format($produk->harga, 0, ',', '.')); ?>" readonly>
                        </div>

                        <a href="<?php echo e(url('/menu_produk')); ?>" class="btn btn-danger mt-3 me-3">Kembali</a>

                        <?php if($user->nomor_telepon != '' && $user->user->name != ''): ?>
                        <button type="submit" name="proses_checkout"
                            class="btn btn-success mt-3 float-right">Checkout</button>
                        <?php endif; ?>

                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/produk/beli.blade.php ENDPATH**/ ?>