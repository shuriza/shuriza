<?php $__env->startSection('title', 'Pendaftaran - Tokoku'); ?>

<?php $__env->startSection('content'); ?>

<div class="card card-primary">
    <div class="card-body">
        <h4 class="text-center text-primary">Pendaftaran</h4>
        <form method="POST" action="<?php echo e(url('proses_pendaftaran')); ?>">
            <?php echo csrf_field(); ?>
            <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" class="form-control <?php $__errorArgs = ['email'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" name="email"
                    tabindex="1" autocomplete="off" value="<?php echo e(old('email')); ?>">

                <?php if($errors->has('email')): ?>
                <p class="mt-3" style="font-size: 15px; color:red;"><i class="bi bi-exclamation-octagon-fill"></i>
                    <?php echo e(ucfirst($errors->first('email'))); ?>

                </p>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <div class="d-block">
                    <label for="password" class="control-label">Password</label>
                </div>
                <input id="password" type="password" class="form-control <?php $__errorArgs = ['password'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>"
                    name="password" tabindex="2" autocomplete="off" value="<?php echo e(old('password')); ?>">

                <?php if($errors->has('password')): ?>
                <p class="mt-3" style="font-size: 15px; color:red;"><i class="bi bi-exclamation-octagon-fill"></i>
                    <?php echo e(ucfirst($errors->first('password'))); ?>

                </p>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-lg btn-block" tabindex="4">
                    Daftar
                </button>
            </div>

            <hr />

            <div class="text-center mb-3">Atau</div>

            <div class="form-group">
                <a href="<?php echo e(url('redirect')); ?>" class="btn btn-light btn-lg btn-block" tabindex="4">
                    <i class="bi bi-google"></i> Daftar Dengan Google
                </a>
            </div>
        </form>
    </div>
</div>

<div class="text-muted text-center mb-3">
    <a href="<?php echo e(url('/login')); ?>">Kembali Login</a>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('auth.layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/auth/pendaftaran.blade.php ENDPATH**/ ?>