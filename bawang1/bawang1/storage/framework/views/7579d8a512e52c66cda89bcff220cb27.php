<?php $__env->startSection('title', 'Tambah Produk'); ?>

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
            <div class="card shadow p-3 mb-5 bg-white rounded mt-3">

                <div class="ml-4">
                    <div class="row mt-3 mb-3">
                        <div class="col">
                            <h5 class="text-primary">Tambah Produk</h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <form method="post" action="<?php echo e(route('menu_produk.store')); ?>" enctype="multipart/form-data">
                                <?php echo csrf_field(); ?>
                                <div class="form-group mr-3">
                                    <label for="nama">Nama</label>
                                    <input type="text" class="form-control border border-primary" id="nama" name="nama"
                                        autocomplete="off" value="<?php echo e(old('nama')); ?>">
                                </div>

                                <?php if($errors->has('nama')): ?>
                                <p class="mt-3" style="font-size: 15px; color:red;"><i
                                        class="bi bi-exclamation-octagon-fill"></i>
                                    <?php echo e(ucfirst($errors->first('nama'))); ?>

                                </p>
                                <?php endif; ?>

                                <div class="form-group mr-3">
                                    <label for="deskripsi">Deskripsi</label>
                                    <input type="text" class="form-control border border-primary" id="deskripsi"
                                        name="deskripsi" autocomplete="off" value="<?php echo e(old('deskripsi')); ?>">
                                </div>

                                <?php if($errors->has('deskripsi')): ?>
                                <p class="mt-3" style="font-size: 15px; color:red;"><i
                                        class="bi bi-exclamation-octagon-fill"></i>
                                    <?php echo e(ucfirst($errors->first('deskripsi'))); ?>

                                </p>
                                <?php endif; ?>

                                <div class="form-group mr-3">
                                    <label for="harga">Harga</label>
                                    <input type="number" class="form-control border border-primary" id="harga"
                                        name="harga" autocomplete="off" value="<?php echo e(old('harga')); ?>">
                                </div>

                                <?php if($errors->has('harga')): ?>
                                <p class="mt-3" style="font-size: 15px; color:red;"><i
                                        class="bi bi-exclamation-octagon-fill"></i>
                                    <?php echo e(ucfirst($errors->first('harga'))); ?>

                                </p>
                                <?php endif; ?>

                                <div class="form-group mr-3">
                                    <label for="status">Status</label>
                                    <select class="form-control border border-primary" id="status" name="status">
                                        <option selected value="">- Pilih Status -</option>

                                        <option value="tersedia" <?php if(old('status')=="tersedia" ): ?> <?php echo e('selected'); ?>

                                            <?php endif; ?>>Tersedia</option>

                                        <option value="masih dalam pengembangan"
                                            <?php if(old('status')=="masih dalam pengembangan" ): ?> <?php echo e('selected'); ?> <?php endif; ?>>
                                            Masih
                                            Dalam Pengembangan</option>

                                        <option value="tidak tersedia" <?php if(old('status')=="tidak tersedia" ): ?>
                                            <?php echo e('selected'); ?> <?php endif; ?>>Tidak Tersedia</option>

                                    </select>
                                </div>

                                <?php if($errors->has('status')): ?>
                                <p class="mt-3" style="font-size: 15px; color:red;"><i
                                        class="bi bi-exclamation-octagon-fill"></i>
                                    <?php echo e(ucfirst($errors->first('status'))); ?>

                                </p>
                                <?php endif; ?>

                                <div class="form-group mr-3">
                                    <label for="file">Upload file ZIP</label>
                                    <div class="custom-file">
                                        <input type="file" class="custom-file-input" name="file" id="file"
                                            value="<?php echo e(old('file')); ?>">
                                        <label class="custom-file-label border border-primary">Choose
                                            file...</label>
                                    </div>
                                </div>

                                <?php if($errors->has('file')): ?>
                                <p class="mt-3" style="font-size: 15px; color:red;"><i
                                        class="bi bi-exclamation-octagon-fill"></i>
                                    <?php echo e(ucfirst($errors->first('file'))); ?>

                                </p>
                                <?php endif; ?>

                                <hr />

                                <button type="submit" class="btn btn-primary mr-3">Tambah</button>
                                <a href="<?php echo e(url('menu_produk')); ?>" class="btn btn-danger">Kembali</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/produk/create.blade.php ENDPATH**/ ?>