<?php $__env->startSection('title', 'Login - Tokoku'); ?>

<?php $__env->startSection('content'); ?>

<div class="card card-primary">

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

    <div class="card-body">
        <h4 class="text-center text-primary">Login</h4>

        <?php if($logout = Session::get('logout')): ?>
        <div class="alert alert-success text-center" role="alert">
            <?php echo e($logout); ?>

        </div>

        <?php elseif($status = Session::get('status')): ?>
        <div class="alert alert-success text-center" role="alert">
            Reset password berhasil. Silakan login terlebih dahulu.
        </div>
        <?php endif; ?>

        <form method="POST" action="<?php echo e(url('proses_login')); ?>">
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
                    <div class="float-right">
                        <a href="<?php echo e(url('lupa_password')); ?>" class="text-small">
                            Lupa Password?
                        </a>
                    </div>
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
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" name="remember" class="custom-control-input" tabindex="3" id="remember-me"
                        <?php if(old('remember')): ?> checked <?php endif; ?>>
                    <label class="custom-control-label" for="remember-me">Remember Me</label>
                </div>
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-primary btn-lg btn-block" tabindex="4">
                    Login
                </button>
            </div>

            <hr />

            <div class="text-center mb-3">Atau</div>

            <div class="form-group">
                <a href="<?php echo e(url('redirect')); ?>" class="btn btn-light btn-lg btn-block" tabindex="4">
                    <i class="bi bi-google"></i> Masuk Dengan Google
                </a>
            </div>
        </form>
    </div>
</div>

<div class="mt-3 mb-3 text-muted text-center">
    Belum mendaftar? <a href="<?php echo e(url('/pendaftaran')); ?>">Daftar</a>
</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('auth.layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/auth/login.blade.php ENDPATH**/ ?>