<?php $__env->startSection('title', 'Profile'); ?>

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

<?php elseif($warning = Session::get('warning')): ?>
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
    icon: "warning",
    title: "<?php echo e($warning); ?>"
    });
</script>
<?php endif; ?>

<div class="container">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4>Profile Anda</h4>
                </div>

                <div class="card-body">
                    <form method="post" action="<?php echo e(url('update_profile')); ?>">
                        <?php echo csrf_field(); ?>

                        <?php $__currentLoopData = $user->customer; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <div class="input-group mb-4">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><i
                                        class="bi bi-person-fill"></i></span>
                            </div>
                            <input type="text" class="form-control" name="name" autocomplete="off"
                                placeholder="Nama Anda" value="<?php echo e((Auth::user()->name == '' ? '' : $user->name)); ?>">
                        </div>

                        <?php if($user->name == ''): ?>
                        <p><i>* Isi nama lengkap Anda (Wajib).</i>
                        </p>
                        <?php endif; ?>

                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon2"><i
                                        class="bi bi-envelope-at-fill"></i></span>
                            </div>
                            <input type="email" class="form-control" placeholder="Email" name="email" autocomplete="off"
                                value="<?php echo e($user->email); ?>" readonly>
                        </div>

                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon3"><i
                                        class="bi bi-telephone-fill"></i></span>
                            </div>
                            <input type="number" class="form-control" placeholder="Nomor telepon" name="nomor_telepon"
                                autocomplete="off"
                                value="<?php echo e(($item->nomor_telepon  == '' ? '' : $item->nomor_telepon)); ?>">
                        </div>

                        <?php if($item->nomor_telepon == ''): ?>
                        <p><i>* Isi nomor telepon agar admin bisa memudahkan menghubungi Anda jika ada kendala
                                pembayaran (Wajib).</i>
                        </p>
                        <?php endif; ?>
                        <button type="submit" name="simpan" class="btn btn-success mt-3 float-right">Simpan</button>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/customer/index.blade.php ENDPATH**/ ?>