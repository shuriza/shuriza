<?php

use App\Models\Admin\SubmenuModel;
?>

<?php $__env->startSection('content'); ?>
<!-- PAGE-HEADER -->
<div class="page-header">
    <h1 class="page-title">Menu</h1>
    <div>
        <ol class="breadcrumb">
            <li class="breadcrumb-item text-gray">Settings</li>
            <li class="breadcrumb-item active" aria-current="page">Menu</li>
        </ol>
    </div>
</div>
<!-- PAGE-HEADER END -->

<!-- Row -->
<div class="row row-sm">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header justify-content-between">
                <h3 class="card-title">List Menu</h3>
                <div>
                    <a class="modal-effect btn btn-primary-light" data-bs-effect="effect-super-scaled" data-bs-toggle="modal" href="#modaldemo8">Tambah Data <i class="fe fe-plus"></i></a>
                </div>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table border text-nowrap text-md-nowrap table-bordered mb-0">
                        <thead>
                            <tr>
                                <th class="border-bottom-0" width="1%">Sort</th>
                                <th class="border-bottom-0" width="1%">Icon</th>
                                <th class="border-bottom-0">Judul</th>
                                <th class="border-bottom-0">Type</th>
                                <th class="border-bottom-0">Redirect</th>
                                <th class="border-bottom-0" width="1%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $d): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr>
                                <td>
                                    <span class="me-4"><?php echo e($d->menu_sort); ?></span>
                                    <button type="button" onclick="sortup('<?php echo e($d->menu_sort); ?>')" class="btn btn-icon btn-sm <?php echo e($d->menu_sort == 1 ? 'btn-gray' : 'btn-success'); ?>" <?php echo e($d->menu_sort == 1 ? "disabled" : ""); ?>><i class="fe fe-arrow-up"></i></button>
                                    <button type="button" onclick="sortdown('<?php echo e($d->menu_sort); ?>')" class="btn btn-icon btn-sm <?php echo e($d->menu_sort == count($data) ? 'btn-gray' : 'btn-success'); ?>" <?php echo e($d->menu_sort == count($data) ? "disabled" : ""); ?>><i class="fe fe-arrow-down"></i></button>
                                </td>
                                <td align="center"><i class="fe fe-<?php echo e($d->menu_icon); ?> text-primary"></i></td>
                                <td><?php echo e($d->menu_judul); ?></td>
                                <td>
                                    <?php if($d->menu_type == 1): ?>
                                    <span class="badge bg-primary badge-sm mb-1 mt-1">Menu</span>
                                    <?php elseif($d->menu_type == 2): ?>
                                    <span class="badge bg-success badge-sm mb-1 mt-1">Sub Menu</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($d->menu_type == 1): ?>
                                    <span class="text-gray fw-medium"><?php echo e($d->menu_redirect); ?></span>
                                    <?php elseif($d->menu_type == 2): ?>
                                    <?php
                                    $submenu = SubmenuModel::where('menu_id', '=', $d->menu_id)->orderBy('submenu_sort', 'ASC')->get();
                                    ?>
                                    <?php $__currentLoopData = $submenu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $sub): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div>
                                        <span class="badge bg-success badge-sm me-1 mb-1 mt-1"><?php echo e($sub->submenu_judul); ?></span>
                                        <span class="badge bg-default text-gray badge-sm mb-1 mt-1"><?php echo e($sub->submenu_redirect); ?></span>
                                    </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                                    <?php endif; ?>
                                </td>
                                <td>
                                    <div class="g-2">
                                        <?php if($d->menu_type == 1): ?>
                                        <a class="btn modal-effect text-primary btn-sm" data-bs-effect="effect-super-scaled" data-bs-toggle="modal" href="#Umodaldemo8" data-bs-toggle="tooltip" data-bs-original-title="Edit" onclick="update(<?php echo e($d); ?>)"><span class="fe fe-edit text-success fs-14"></span></a>
                                        <?php elseif($d->menu_type == 2): ?>
                                        <a class="btn modal-effect text-primary btn-sm" data-bs-effect="effect-super-scaled" data-bs-toggle="modal" href="#Umodaldemo8" data-bs-toggle="tooltip" data-bs-original-title="Edit" onclick="updatewithsub(<?php echo e($d); ?>,<?php echo e($submenu); ?>)"><span class="fe fe-edit text-success fs-14"></span></a>
                                        <?php endif; ?>
                                        <a class="btn modal-effect text-danger btn-sm" data-bs-effect="effect-super-scaled" data-bs-toggle="modal" href="#Hmodaldemo8" onclick="hapus(<?php echo e($d); ?>)"><span class="fe fe-trash-2 fs-14"></span></a>
                                    </div>
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
<!-- End Row -->

<?php echo $__env->make('Master.Menu.tambah', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php echo $__env->make('Master.Menu.ubah', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php echo $__env->make('Master.Menu.hapus', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<script>
    function sortup(sort) {
        window.location.href = "<?php echo e(url('/admin/menu/sortup')); ?>/" + sort;
    }

    function sortdown(sort) {
        window.location.href = "<?php echo e(url('/admin/menu/sortdown')); ?>/" + sort;
    }
</script>

<script>
    function update(data) {
        $("#myFormU").attr("action", "<?php echo e(url('/admin/menu')); ?>/" + data.menu_id);
        $("input[name='uicon']").val(data.menu_icon);
        $("input[name='ujudul']").val(data.menu_judul);
        $("select[name='utype']").val(data.menu_type);
        $("input[name='uredirect']").val(data.menu_redirect);
        setTypeU();
    }

    function updatewithsub(data,sub) {
        $("#myFormU").attr("action", "<?php echo e(url('/admin/menu')); ?>/" + data.menu_id);
        $("input[name='uicon']").val(data.menu_icon);
        $("input[name='ujudul']").val(data.menu_judul);
        $("select[name='utype']").val(data.menu_type);
        $("input[name='uredirect']").val(data.menu_redirect);
        setTypeU();
        setSub(sub);
    }

    function hapus(data) {
        $("input[name='idmenu']").val(data.menu_id);
        $("#vmenu").html("menu " + "<b>" + data.menu_judul + "</b>");
    }

    function validasi(judul, status) {
        swal({
            title: judul,
            type: status,
            confirmButtonText: "Iya."
        });
    }
</script>

<?php $__env->stopSection(); ?>
<?php echo $__env->make('Master.Layouts.app', ['title' => $title], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /Users/willyap/Sites/wordpress/Sistem-Persediaan-Laravel/resources/views/Master/Menu/index.blade.php ENDPATH**/ ?>