<?php $__env->startSection('title', 'Update Produk'); ?>

<?php $__env->startSection('content'); ?>

<div class="container">

    <div class="row">
        <div class="col-12">
            <div class="card shadow p-3 mb-5 bg-white rounded mt-3">

                <div class="ml-4">
                    <div class="row mt-3 mb-3">
                        <div class="col">
                            <h5 class="text-primary">Update Produk</h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <form method="post" action="<?php echo e(route('menu_produk.update', $data->id)); ?>"
                                enctype="multipart/form-data">
                                <?php echo csrf_field(); ?>
                                <?php echo method_field('PUT'); ?>

                                <div class="form-group mr-3">
                                    <label for="nama">Nama</label>
                                    <input type="text" class="form-control border border-primary" id="nama" name="nama"
                                        autocomplete="off" value="<?php echo e($data->nama); ?>">
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
                                        name="deskripsi" autocomplete="off" value="<?php echo e($data->deskripsi); ?>">
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
                                        name="harga" autocomplete="off" value="<?php echo e($data->harga); ?>">
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
                                        <option selected value="<?php echo e($data->status); ?>"><?php echo e(ucwords($data->status)); ?></option>

                                        <?php
                                        $statusData = [
                                        'tersedia',
                                        'masih dalam pengembangan',
                                        'tidak tersedia'
                                        ];
                                        ?>

                                        <?php $__currentLoopData = $statusData; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <?php if($item != $data->status): ?>
                                        <option value="<?php echo e($item); ?>"><?php echo e(ucwords($item)); ?></option>
                                        <?php endif; ?>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

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
                                        <input type="file" class="custom-file-input" name="file" id="file">
                                        <label class="custom-file-label border border-primary"><?php echo e($data->file); ?></label>
                                    </div>
                                </div>

                                <i>* Kosongkan jika tidak mengupload</i>

                                <hr />

                                <button type="submit" class="btn btn-primary mr-3">Update</button>
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
<?php echo $__env->make('layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\shuriza\bawang1\bawang1\resources\views/produk/edit.blade.php ENDPATH**/ ?>