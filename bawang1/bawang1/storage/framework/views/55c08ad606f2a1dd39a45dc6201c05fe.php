<?php $__env->startSection('title', 'Ganti Password'); ?>

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

<div class="container">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4>Ganti Password</h4>
                </div>

                <div class="card-body">
                    <form method="post" action="<?php echo e(url('proses_ganti_password')); ?>">
                        <?php echo csrf_field(); ?>

                        <div class="form-group">
                            <label for="password_baru">Password baru</label>
                            <input type="password" class="form-control" id="password_baru" name="password_baru"
                                autocomplete="off" value="<?php echo e(old('password_baru')); ?>">
                        </div>

                        <?php if($errors->has('password_baru')): ?>
                        <p class="mt-3" style="font-size: 15px; color:red;"><i
                                class="bi bi-exclamation-octagon-fill"></i>
                            <?php echo e(ucfirst($errors->first('password_baru'))); ?>

                        </p>
                        <?php endif; ?>

                        <div class="form-group">
                            <label for="konfirmasi_password_baru">Konfirmasi password baru</label>
                            <input type="password" class="form-control" id="konfirmasi_password_baru"
                                name="konfirmasi_password_baru" autocomplete="off"
                                value="<?php echo e(old('konfirmasi_password_baru')); ?>">
                        </div>

                        <?php if($errors->has('konfirmasi_password_baru')): ?>
                        <p class="mt-3" style="font-size: 15px; color:red;"><i
                                class="bi bi-exclamation-octagon-fill"></i>
                            <?php echo e(ucfirst($errors->first('konfirmasi_password_baru'))); ?>

                        </p>
                        <?php endif; ?>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="lihat_password">
                            <label class="form-check-label" for="lihat_password">
                                Lihat password
                            </label>
                        </div>

                        <button type="submit" name="ganti" class="btn btn-success mt-3 float-right">Ganti</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/pengaturan/ganti_password.blade.php ENDPATH**/ ?>