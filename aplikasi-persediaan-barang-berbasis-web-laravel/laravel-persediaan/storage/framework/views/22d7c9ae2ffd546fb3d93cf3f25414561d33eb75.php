 <?php

    use App\Models\Admin\AksesModel;
    use App\Models\Admin\MenuModel;
    use App\Models\Admin\SubmenuModel;
    use Illuminate\Support\Facades\Session;

    $menu = MenuModel::orderBy('menu_sort', 'ASC')->get();
    ?>
 <!--APP-SIDEBAR-->
 <div class="sticky">
     <div class="app-sidebar__overlay" data-bs-toggle="sidebar"></div>
     <div class="app-sidebar">
         <div class="side-header">
             <a class="header-brand1" href="<?php echo e(url('/admin')); ?>">
                 <?php if($web->web_logo == '' || $web->web_logo == 'default.png'): ?>
                 <img src="<?php echo e(url('/assets/default/web/default.png')); ?>" height="40px" class="header-brand-img toggle-logo" alt="logo">
                 <div class="header-brand-img desktop-logo">
                     <div class="d-flex align-items-center">
                         <img src="<?php echo e(url('/assets/default/web/default.png')); ?>" height="40px" class="me-1" alt="logo">
                         <h4 class="fw-bold mt-4 text-white text-uppercase text-truncate"><?php echo e($web->web_nama); ?></h4>
                     </div>
                 </div>
                 <img src="<?php echo e(url('/assets/default/web/default.png')); ?>" height="40px" class="header-brand-img light-logo" alt="logo">
                 <div class="header-brand-img light-logo1">
                     <div class="d-flex align-items-center">
                         <img src="<?php echo e(url('/assets/default/web/default.png')); ?>" height="40px" class="me-1" alt="logo">
                         <h4 class="fw-bold mt-4 text-black text-uppercase text-truncate"><?php echo e($web->web_nama); ?></h4>
                     </div>
                 </div>
                 <?php else: ?>
                 <img src="<?php echo e(asset('storage/web/' . $web->web_logo)); ?>" height="40px" class="header-brand-img toggle-logo" alt="logo">
                 <div class="header-brand-img desktop-logo">
                     <div class="d-flex align-items-center">
                         <img src="<?php echo e(asset('storage/web/' . $web->web_logo)); ?>" height="40px" class="me-1" alt="logo">
                         <h4 class="fw-bold mt-4 text-white text-uppercase text-truncate"><?php echo e($web->web_nama); ?></h4>
                     </div>
                 </div>
                 <img src="<?php echo e(asset('storage/web/' . $web->web_logo)); ?>" height="40px" class="header-brand-img light-logo" alt="logo">
                 <div class="header-brand-img light-logo1">
                     <div class="d-flex align-items-center">
                         <img src="<?php echo e(asset('storage/web/' . $web->web_logo)); ?>" height="40px" class="me-1" alt="logo">
                         <h4 class="fw-bold mt-4 text-black text-uppercase text-truncate"><?php echo e($web->web_nama); ?></h4>
                     </div>
                 </div>
                 <?php endif; ?>
             </a>
             <!-- LOGO -->
         </div>
         <div class="main-sidemenu">
             <div class="slide-left disabled" id="slide-left"><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                     <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
                 </svg></div>
             <ul class="side-menu">
                 <?php if(count($menu) > 0): ?>
                 <li class="sub-category">
                     <h3>Menu</h3>
                 </li>
                 <?php endif; ?>
                 <?php $__currentLoopData = $menu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $m): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                 <?php $getMenu = AksesModel::where(array('role_id' => Session::get('user')->role_id, 'menu_id' => $m->menu_id, 'akses_type' => 'view'))->count(); ?>
                 <?php if($m->menu_type == 1): ?>
                 <?php if($getMenu > 0): ?>
                 <li class="slide">
                     <a class="side-menu__item <?php echo e($title == $m->menu_judul ? 'active' : ''); ?>" data-bs-toggle="slide" href="<?php echo e(url('/admin').$m->menu_redirect); ?>"><i class="side-menu__icon fe fe-<?php echo e($m->menu_icon); ?>"></i><span class="side-menu__label"><?php echo e($m->menu_judul); ?></span></a>
                 </li>
                 <?php endif; ?>
                 <?php elseif($m->menu_type == 2): ?>
                 <?php if($getMenu > 0): ?>
                 <?php
                    $submenu = SubmenuModel::where('menu_id', '=', $m->menu_id)->orderBy('submenu_sort', 'ASC')->get();
                    $checkMenu = SubmenuModel::join('tbl_menu', 'tbl_menu.menu_id', '=', 'tbl_submenu.menu_id')->select()->where(array('tbl_menu.menu_judul' => $m->menu_judul, 'tbl_submenu.submenu_judul' => $title))->count();
                    ?>
                 <li class="slide <?php echo e($checkMenu > 0 ? 'is-expanded' : ''); ?>">
                     <a class="side-menu__item <?php echo e($checkMenu > 0 ? 'active' : ''); ?>" data-bs-toggle="slide" href="javascript:void(0)">
                         <i class="side-menu__icon fe fe-<?php echo e($m->menu_icon); ?>"></i>
                         <span class="side-menu__label"><?php echo e($m->menu_judul); ?></span><i class="angle fe fe-chevron-right"></i></a>
                     <ul class="slide-menu">
                         <?php $__currentLoopData = $submenu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $sub): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                         <?php $getSubmenu = AksesModel::where(array('role_id' => Session::get('user')->role_id, 'submenu_id' => $sub->submenu_id, 'akses_type' => 'view'))->count(); ?>
                         <?php if($getSubmenu > 0): ?>
                         <li><a href="<?php echo e(url('/admin').$sub->submenu_redirect); ?>" class="slide-item <?php echo e($title == $sub->submenu_judul ? 'active' : ''); ?>"><?php echo e($sub->submenu_judul); ?></a></li>
                         <?php endif; ?>
                         <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                     </ul>
                 </li>
                 <?php endif; ?>
                 <?php endif; ?>
                 <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                 <li class="sub-category">
                     <h3>Other</h3>
                 </li>

                 <?php $getSetting = AksesModel::where(array('role_id' => Session::get('user')->role_id, 'othermenu_id' => 1, 'akses_type' => 'view'))->count(); ?>
                 <?php $getSettingMenu = AksesModel::where(array('role_id' => Session::get('user')->role_id, 'othermenu_id' => 2, 'akses_type' => 'view'))->count(); ?>
                 <?php $getSettingRole = AksesModel::where(array('role_id' => Session::get('user')->role_id, 'othermenu_id' => 3, 'akses_type' => 'view'))->count(); ?>
                 <?php $getSettingUser = AksesModel::where(array('role_id' => Session::get('user')->role_id, 'othermenu_id' => 4, 'akses_type' => 'view'))->count(); ?>
                 <?php $getSettingAkses = AksesModel::where(array('role_id' => Session::get('user')->role_id, 'othermenu_id' => 5, 'akses_type' => 'view'))->count(); ?>
                 <?php $getSettingWeb = AksesModel::where(array('role_id' => Session::get('user')->role_id, 'othermenu_id' => 6, 'akses_type' => 'view'))->count(); ?>

                 <?php if($getSetting > 0): ?>
                 <li class="slide <?php echo e($title == 'Menu' || $title == 'Role' || $title == 'User' || $title == 'Akses' || $title == 'Web' ? 'is-expanded' : ''); ?>">
                     <a class="side-menu__item" data-bs-toggle="slide" href="javascript:void(0)">
                         <i class="side-menu__icon fe fe-settings"></i>
                         <span class="side-menu__label">Settings</span><i class="angle fe fe-chevron-right"></i></a>
                     <ul class="slide-menu">
                         <?php if($getSettingMenu > 0): ?>
                         <li><a href="<?php echo e(url('/admin/menu')); ?>" class="slide-item <?php echo e($title == 'Menu' ? 'active' : ''); ?>">Menu</a></li>
                         <?php endif; ?>
                         <li class="sub-slide <?php echo e($title == 'Role' || $title == 'User' || $title == 'Akses' ? 'is-expanded' : ''); ?>">
                             <a class="sub-side-menu__item" data-bs-toggle="sub-slide" href="javascript:void(0)"><span class="sub-side-menu__label">User</span><i class="sub-angle fe fe-chevron-right"></i></a>
                             <ul class="sub-slide-menu">
                                 <?php if($getSettingRole > 0): ?>
                                 <li><a class="sub-slide-item <?php echo e($title == 'Role' ? 'active' : ''); ?>" href="<?php echo e(url('/admin/role')); ?>">Role</a></li>
                                 <?php endif; ?>
                                 <?php if($getSettingUser > 0): ?>
                                 <li><a class="sub-slide-item <?php echo e($title == 'User' ? 'active' : ''); ?>" href="<?php echo e(url('/admin/user')); ?>">List</a></li>
                                 <?php endif; ?>
                                 <?php if($getSettingAkses > 0): ?>
                                 <li><a class="sub-slide-item <?php echo e($title == 'Akses' ? 'active' : ''); ?>" href="<?php echo e(url('/admin/akses/role')); ?>">Akses</a></li>
                                 <?php endif; ?>
                             </ul>
                         </li>
                         <?php if($getSettingWeb > 0): ?>
                         <li><a href="<?php echo e(url('/admin/web')); ?>" class="slide-item <?php echo e($title == 'Web' ? 'active' : ''); ?>">Web</a></li>
                         <?php endif; ?>
                     </ul>
                 </li>
                 <?php endif; ?>


                 <li class="slide">
                     <a class="side-menu__item" data-bs-effect="effect-super-scaled" data-bs-toggle="modal" href="#modalLogout"><i class="side-menu__icon fe fe-log-out"></i><span class="side-menu__label">Log Out</span></a>
                 </li>


             </ul>
             <div class="slide-right" id="slide-right"><svg xmlns="http://www.w3.org/2000/svg" fill="#7b8191" width="24" height="24" viewBox="0 0 24 24">
                     <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z" />
                 </svg></div>
         </div>
     </div>
     <!--/APP-SIDEBAR-->
 </div><?php /**PATH /Users/willyap/Sites/wordpress/Sistem-Persediaan-Laravel/resources/views/Master/Layouts/sidebar-left.blade.php ENDPATH**/ ?>