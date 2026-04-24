<?php $__env->startSection('title', 'Metode Pembayaran'); ?>

<?php $__env->startSection('content'); ?>

<div class="container mb-3">

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
        icon: "info",
        title: "<?php echo e($success); ?>"
        });
    </script>
    <?php endif; ?>

    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4>Metode Pembayaran</h4>
                </div>

                <div class="card-body">
                    <div class="form-group">
                        <label for="metode_pembayaran">Pilih metode pembayaran</label>

                        <select class="form-control mb-3" id="metode_pembayaran">
                            <option value="midtrans">Midtrans</option>
                        </select>
                        <i>* Saat ini hanya tersedia metode pembayaran dengan Midtrans.</i>
                    </div>

                    <a href="<?php echo e(url('/menu_produk')); ?>" class="btn btn-danger mt-3 me-3">Kembali</a>
                    <button type="button" id="pay-button" class="btn btn-success mt-3 float-right">Pilih
                        Pembayaran</button>
                </div>
            </div>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/pembayaran/metode_pembayaran.blade.php ENDPATH**/ ?>