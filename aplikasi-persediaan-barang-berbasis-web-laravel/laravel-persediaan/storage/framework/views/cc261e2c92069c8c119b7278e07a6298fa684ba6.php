<?php

use App\Models\Admin\AksesModel;
use App\Models\Admin\SubmenuModel; ?>

<?php $__env->startSection('content'); ?>
<!-- PAGE-HEADER -->
<div class="page-header">
    <h1 class="page-title">Akses</h1>
    <div>
        <ol class="breadcrumb">
            <li class="breadcrumb-item text-gray">Settings</li>
            <li class="breadcrumb-item active" aria-current="page">Akses</li>
        </ol>
    </div>
</div>
<!-- PAGE-HEADER END -->

<!-- ROW -->
<div class="row row-sm">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-body">

                <div class="row">
                    <div class="col-md-5">
                        <div class="form-group">
                            <h4 class="text-gray">Role</h4>
                            <div class="d-flex">
                                <select name="role" class="form-control">
                                    <option value="">-- Pilih Role --</option>
                                    <?php $__currentLoopData = $role; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $r): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <option value="<?php echo e($r->role_id); ?>" <?php echo e($roleid == $r->role_id ? 'selected' : ''); ?>><?php echo e($r->role_title); ?></option>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </select>
                                <div class="ms-1">
                                    <button type="submit" onclick="submitRole()" class="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php if($detailrole != ''): ?>
                    <div class="col-md-7 d-flex justify-content-end align-items-center">
                        <div>
                            <?php if(Session::get('user')->role_slug != $detailrole->role_slug): ?>
                            <button  class="btn btn-gray me-2" onclick="unsetAll(<?php echo e($detailrole->role_id); ?>)">Non-aktifkan Semua Akses</button>
                            <?php else: ?>
                            <button disabled class="btn btn-gray me-2">Non-aktifkan Semua Akses</button>
                            <?php endif; ?>
                        </div>
                        <div>
                            <button class="btn btn-primary" onclick="setAll(<?php echo e($detailrole->role_id); ?>)">Aktifkan Semua Akses</button>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>

                <?php if($detailrole != ''): ?>
                <?php if(count($menu) > 0): ?>
                <h4 class="text-gray">Hak Akses Menu <span class="badge bg-primary badge-sm"><?php echo e($detailrole == '' ? '' : $detailrole->role_title); ?></span></h4>
                <?php endif; ?>
                <div class="table-responsive mb-4">
                    <table class="table border text-nowrap text-md-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>Menu</th>
                                <th width="1%">View</th>
                                <th width="1%">Create</th>
                                <th width="1%">Update</th>
                                <th width="1%">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php $__currentLoopData = $menu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $m): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr>
                                <td>
                                    <span class="fw-bold">
                                        <?php echo e($m->menu_judul); ?>

                                    </span>
                                </td>
                                <td>
                                    <?php
                                    $getView = AksesModel::where(array('menu_id' => $m->menu_id, 'role_id' => $roleid, 'akses_type' => 'view'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5" onclick="">
                                        <?php if($getView == ''): ?>
                                        <input type="checkbox" onchange="addAkses('<?php echo e($m->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'view')" name="viewMenu[]" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('<?php echo e($m->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'view')" checked name="viewMenu[]" class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                </td>
                                <td>
                                    <?php if($getView != ''): ?>
                                    <?php
                                    $getCreate = AksesModel::where(array('menu_id' => $m->menu_id, 'role_id' => $roleid, 'akses_type' => 'create'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getCreate == ''): ?>
                                        <input type="checkbox" onchange="addAkses('<?php echo e($m->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'create')" name="createMenu[]" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('<?php echo e($m->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'create')" checked name="createMenu[]" class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView != ''): ?>
                                    <?php
                                    $getUpdate = AksesModel::where(array('menu_id' => $m->menu_id, 'role_id' => $roleid, 'akses_type' => 'update'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getUpdate == ''): ?>
                                        <input type="checkbox" onchange="addAkses('<?php echo e($m->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'update')" name="updateMenu[]" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('<?php echo e($m->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'update')" checked name="updateMenu[]" class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView != ''): ?>
                                    <?php
                                    $getDelete = AksesModel::where(array('menu_id' => $m->menu_id, 'role_id' => $roleid, 'akses_type' => 'delete'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getDelete == ''): ?>
                                        <input type="checkbox" onchange="addAkses('<?php echo e($m->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'delete')" name="deleteMenu[]" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('<?php echo e($m->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'delete')" checked name="deleteMenu[]" class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                    </table>
                </div>
                <?php if(count($menusub) > 0): ?>
                <h4 class="text-gray">Hak Akses Sub Menu <span class="badge bg-primary badge-sm"><?php echo e($detailrole == '' ? '' : $detailrole->role_title); ?></span></h4>
                <?php endif; ?>
                <?php $__currentLoopData = $menusub; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ms): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="d-flex align-items-center justify-content-between mt-4 mb-0">
                    <h6 class="fw-bold"><?php echo e($ms->menu_judul); ?></h6>
                    <?php
                    $getView1 = AksesModel::where(array('menu_id' => $ms->menu_id, 'role_id' => $roleid, 'akses_type' => 'view'))->first();
                    ?>
                    <label class="custom-switch form-switch mb-3">
                        <?php if($getView1 == ''): ?>
                        <input type="checkbox" onchange="addAkses('<?php echo e($ms->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'view')" class="custom-switch-input">
                        <?php else: ?>
                        <input type="checkbox" onchange="removeAkses('<?php echo e($ms->menu_id); ?>', '<?php echo e($roleid); ?>', 'menu', 'view')" checked class="custom-switch-input">
                        <?php endif; ?>
                        <span class="custom-switch-indicator custom-switch-indicator-md"></span>
                    </label>
                </div>
                <div class="table-responsive mb-4">
                    <table class="table border text-nowrap text-md-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>Menu</th>
                                <th width="1%">View</th>
                                <th width="1%">Create</th>
                                <th width="1%">Update</th>
                                <th width="1%">Delete</th>
                            </tr>
                        </thead>
                        <tbody>

                            <?php
                            $submenu = SubmenuModel::where('menu_id', '=', $ms->menu_id)->orderBy('submenu_sort', 'ASC')->get();
                            ?>
                            <?php $__currentLoopData = $submenu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $sm): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr>
                                <td>
                                    <span class="fw-bold">
                                        <?php echo e($sm->submenu_judul); ?>

                                    </span>
                                </td>
                                <td>
                                    <?php if($getView1 != ''): ?>
                                    <?php
                                    $getView11 = AksesModel::where(array('submenu_id' => $sm->submenu_id, 'role_id' => $roleid, 'akses_type' => 'view'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getView11 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('<?php echo e($sm->submenu_id); ?>', '<?php echo e($roleid); ?>', 'submenu', 'view')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('<?php echo e($sm->submenu_id); ?>', '<?php echo e($roleid); ?>', 'submenu', 'view')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses <?php echo e($ms->menu_judul); ?>">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView1 != ''): ?>
                                    <?php if($getView11 != ''): ?>
                                    <?php
                                    $getCreate1 = AksesModel::where(array('submenu_id' => $sm->submenu_id, 'role_id' => $roleid, 'akses_type' => 'create'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getCreate1 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('<?php echo e($sm->submenu_id); ?>', '<?php echo e($roleid); ?>', 'submenu', 'create')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('<?php echo e($sm->submenu_id); ?>', '<?php echo e($roleid); ?>', 'submenu', 'create')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses <?php echo e($ms->menu_judul); ?>">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView1 != ''): ?>
                                    <?php if($getView11 != ''): ?>
                                    <?php
                                    $getUpdate1 = AksesModel::where(array('submenu_id' => $sm->submenu_id, 'role_id' => $roleid, 'akses_type' => 'update'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getUpdate1 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('<?php echo e($sm->submenu_id); ?>', '<?php echo e($roleid); ?>', 'submenu', 'update')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('<?php echo e($sm->submenu_id); ?>', '<?php echo e($roleid); ?>', 'submenu', 'update')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses <?php echo e($ms->menu_judul); ?>">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView1 != ''): ?>
                                    <?php if($getView11 != ''): ?>
                                    <?php
                                    $getDelete1 = AksesModel::where(array('submenu_id' => $sm->submenu_id, 'role_id' => $roleid, 'akses_type' => 'delete'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getDelete1 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('<?php echo e($sm->submenu_id); ?>', '<?php echo e($roleid); ?>', 'submenu', 'delete')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('<?php echo e($sm->submenu_id); ?>', '<?php echo e($roleid); ?>', 'submenu', 'delete')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses <?php echo e($ms->menu_judul); ?>">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>


                        </tbody>
                    </table>
                </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                <div class="d-flex justify-content-between mb-2">
                    <h4 class="text-gray">Hak Akses Settings <span class="badge bg-primary badge-sm"><?php echo e($detailrole == '' ? '' : $detailrole->role_title); ?></span></h4>
                    <?php
                    $getView2 = AksesModel::where(array('othermenu_id' => 1, 'role_id' => $detailrole->role_id, 'akses_type' => 'view'))->first();
                    ?>
                    <?php if(Session::get('user')->role_slug != $detailrole->role_slug): ?>
                    <label class="custom-switch form-switch mb-3">
                        <?php if($getView2 == ''): ?>
                        <input type="checkbox" onchange="addAkses('1', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'view')" class="custom-switch-input">
                        <?php else: ?>
                        <input type="checkbox" onchange="removeAkses('1', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'view')" checked class="custom-switch-input">
                        <?php endif; ?>
                        <span class="custom-switch-indicator custom-switch-indicator-md"></span>
                    </label>
                    <?php endif; ?>
                </div>

                <div class="table-responsive mb-4">
                    <table class="table border text-nowrap text-md-nowrap mb-0">
                        <thead>
                            <tr>
                                <th>Menu</th>
                                <th width="1%">View</th>
                                <th width="1%">Create</th>
                                <th width="1%">Update</th>
                                <th width="1%">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <span class="fw-bold">
                                        Menu
                                    </span>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php
                                    $getView21 = AksesModel::where(array('othermenu_id' => 2, 'role_id' => $roleid, 'akses_type' => 'view'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getView21 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('2', '<?php echo e($roleid); ?>', 'othermenu', 'view')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('2', '<?php echo e($roleid); ?>', 'othermenu', 'view')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView21 != ''): ?>
                                    <?php
                                    $getCreate2 = AksesModel::where(array('othermenu_id' => 2, 'role_id' => $roleid, 'akses_type' => 'create'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getCreate2 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('2', '<?php echo e($roleid); ?>', 'othermenu', 'create')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('2', '<?php echo e($roleid); ?>', 'othermenu', 'create')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView21 != ''): ?>
                                    <?php
                                    $getUpdate2 = AksesModel::where(array('othermenu_id' => 2, 'role_id' => $roleid, 'akses_type' => 'update'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getUpdate2 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('2', '<?php echo e($roleid); ?>', 'othermenu', 'update')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('2', '<?php echo e($roleid); ?>', 'othermenu', 'update')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView21 != ''): ?>
                                    <?php
                                    $getDelete2 = AksesModel::where(array('othermenu_id' => 2, 'role_id' => $roleid, 'akses_type' => 'delete'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getDelete2 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('2', '<?php echo e($roleid); ?>', 'othermenu', 'delete')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('2', '<?php echo e($roleid); ?>', 'othermenu', 'delete')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="fw-bold">
                                        Role
                                    </span>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php
                                    $getView3 = AksesModel::where(array('othermenu_id' => 3, 'role_id' => $roleid, 'akses_type' => 'view'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getView3 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('3', '<?php echo e($roleid); ?>', 'othermenu', 'view')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('3', '<?php echo e($roleid); ?>', 'othermenu', 'view')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView3 != ''): ?>
                                    <?php
                                    $getCreate3 = AksesModel::where(array('othermenu_id' => 3, 'role_id' => $roleid, 'akses_type' => 'create'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getCreate3 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('3', '<?php echo e($roleid); ?>', 'othermenu', 'create')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('3', '<?php echo e($roleid); ?>', 'othermenu', 'create')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView3 != ''): ?>
                                    <?php
                                    $getUpdate3 = AksesModel::where(array('othermenu_id' => 3, 'role_id' => $roleid, 'akses_type' => 'update'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getUpdate3 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('3', '<?php echo e($roleid); ?>', 'othermenu', 'update')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('3', '<?php echo e($roleid); ?>', 'othermenu', 'update')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView3 != ''): ?>
                                    <?php
                                    $getDelete3 = AksesModel::where(array('othermenu_id' => 3, 'role_id' => $roleid, 'akses_type' => 'delete'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getDelete3 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('3', '<?php echo e($roleid); ?>', 'othermenu', 'delete')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('3', '<?php echo e($roleid); ?>', 'othermenu', 'delete')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="fw-bold">
                                        User
                                    </span>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php
                                    $getView4 = AksesModel::where(array('othermenu_id' => 4, 'role_id' => $roleid, 'akses_type' => 'view'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getView4 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('4', '<?php echo e($roleid); ?>', 'othermenu', 'view')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('4', '<?php echo e($roleid); ?>', 'othermenu', 'view')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView4 != ''): ?>
                                    <?php
                                    $getCreate4 = AksesModel::where(array('othermenu_id' => 4, 'role_id' => $roleid, 'akses_type' => 'create'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getCreate4 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('4', '<?php echo e($roleid); ?>', 'othermenu', 'create')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('4', '<?php echo e($roleid); ?>', 'othermenu', 'create')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView4 != ''): ?>
                                    <?php
                                    $getUpdate4 = AksesModel::where(array('othermenu_id' => 4, 'role_id' => $roleid, 'akses_type' => 'update'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getUpdate4 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('4', '<?php echo e($roleid); ?>', 'othermenu', 'update')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('4', '<?php echo e($roleid); ?>', 'othermenu', 'update')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView4 != ''): ?>
                                    <?php
                                    $getDelete4 = AksesModel::where(array('othermenu_id' => 4, 'role_id' => $roleid, 'akses_type' => 'delete'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getDelete4 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('4', '<?php echo e($roleid); ?>', 'othermenu', 'delete')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('4', '<?php echo e($roleid); ?>', 'othermenu', 'delete')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php if(Session::get('user')->role_slug != $detailrole->role_slug): ?>
                            <tr>
                                <td>
                                    <span class="fw-bold">
                                        Akses
                                    </span>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php
                                    $getView5 = AksesModel::where(array('othermenu_id' => 5, 'role_id' => $detailrole->role_id, 'akses_type' => 'view'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getView5 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('5', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'view')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('5', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'view')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView5 != ''): ?>
                                    <?php
                                    $getCreate5 = AksesModel::where(array('othermenu_id' => 5, 'role_id' => $detailrole->role_id, 'akses_type' => 'create'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getCreate5 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('5', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'create')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('5', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'create')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView5 != ''): ?>
                                    <?php
                                    $getUpdate5 = AksesModel::where(array('othermenu_id' => 5, 'role_id' => $detailrole->role_id, 'akses_type' => 'update'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getUpdate5 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('5', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'update')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('5', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'update')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView5 != ''): ?>
                                    <?php
                                    $getDelete5 = AksesModel::where(array('othermenu_id' => 5, 'role_id' => $detailrole->role_id, 'akses_type' => 'delete'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getDelete5 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('5', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'delete')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('5', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'delete')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endif; ?>

                            <tr>
                                <td>
                                    <span class="fw-bold">
                                        Web
                                    </span>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php
                                    $getView6 = AksesModel::where(array('othermenu_id' => 6, 'role_id' => $detailrole->role_id, 'akses_type' => 'view'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getView6 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('6', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'view')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('6', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'view')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView6 != ''): ?>
                                    <?php
                                    $getCreate6 = AksesModel::where(array('othermenu_id' => 6, 'role_id' => $detailrole->role_id, 'akses_type' => 'create'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getCreate6 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('6', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'create')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('6', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'create')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView6 != ''): ?>
                                    <?php
                                    $getUpdate6 = AksesModel::where(array('othermenu_id' => 6, 'role_id' => $detailrole->role_id, 'akses_type' => 'update'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getUpdate6 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('6', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'update')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('6', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'update')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if($getView2 != ''): ?>
                                    <?php if($getView6 != ''): ?>
                                    <?php
                                    $getDelete6 = AksesModel::where(array('othermenu_id' => 6, 'role_id' => $detailrole->role_id, 'akses_type' => 'delete'))->first();
                                    ?>
                                    <label class="custom-switch form-switch me-5">
                                        <?php if($getDelete6 == ''): ?>
                                        <input type="checkbox" onchange="addAkses('6', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'delete')" class="custom-switch-input">
                                        <?php else: ?>
                                        <input type="checkbox" onchange="removeAkses('6', '<?php echo e($detailrole->role_id); ?>', 'othermenu', 'delete')" checked class="custom-switch-input">
                                        <?php endif; ?>
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses view">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                    <?php else: ?>
                                    <label class="custom-switch form-switch me-5" data-bs-placement="top" data-bs-toggle="tooltip" title="" data-bs-original-title="Aktifkan akses Settings">
                                        <input type="checkbox" disabled name="custom-switch-checkbox1" class="custom-switch-input">
                                        <span class="custom-switch-indicator custom-switch-indicator-sm"></span>
                                    </label>
                                    <?php endif; ?>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <?php endif; ?>

            </div>

        </div>
    </div>
</div>
<!-- END ROW -->

<?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
<script>
    function submitRole() {
        role = $('select[name="role"]').val();
        if (role != '') {
            window.location.href = "<?php echo e(url('/admin/akses')); ?>/" + parseInt(role);
        } else {
            window.location.href = "<?php echo e(url('/admin/akses')); ?>/" + "role";
        }
    }

    function addAkses(idmenu, idrole, type, akses) {
        window.location.href = "<?php echo e(url('/admin/akses/addAkses')); ?>/" + idmenu + '/' + parseInt(idrole) + "/" + type + "/" + akses;
    }

    function removeAkses(idmenu, idrole, type, akses) {
        window.location.href = "<?php echo e(url('/admin/akses/removeAkses')); ?>/" + idmenu + '/' + parseInt(idrole) + "/" + type + "/" + akses;
    }

    function setAll(idrole) {
        window.location.href = "<?php echo e(url('/admin/akses/setAll')); ?>/" + parseInt(idrole);
    }

    function unsetAll(idrole) {
        window.location.href = "<?php echo e(url('/admin/akses/unsetAll')); ?>/" + parseInt(idrole);
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
<?php echo $__env->make('Master.Layouts.app', ['title' => $title], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /Users/willyap/Sites/wordpress/Sistem-Persediaan-Laravel/resources/views/Master/Akses/index.blade.php ENDPATH**/ ?>