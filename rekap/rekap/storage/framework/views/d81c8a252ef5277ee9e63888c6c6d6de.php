<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Form & Daftar Izin Presensi</title>

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="<?php echo e(asset('plugins/fontawesome-free/css/all.min.css')); ?>">
  <!-- DataTables -->
  <link rel="stylesheet" href="<?php echo e(asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css')); ?>">
  <link rel="stylesheet" href="<?php echo e(asset('plugins/datatables-responsive/css/responsive.bootstrap4.min.css')); ?>">
  <link rel="stylesheet" href="<?php echo e(asset('plugins/datatables-buttons/css/buttons.bootstrap4.min.css')); ?>">
  <!-- Theme style -->
  <link rel="stylesheet" href="<?php echo e(asset('dist/css/adminlte.min.css')); ?>">
</head>

<body class="hold-transition sidebar-mini">
  <div class="wrapper">
    <!-- CONTENT WRAPPER -->
    <div class="content-wrapper">
      <div class="container-fluid pt-3">
        <!-- FORM IZIN -->
        <div class="card card-outline card-primary mb-4">
          <div class="card-header text-center">
            <h3 class="card-title">Form Izin Presensi</h3>
          </div>
          <div class="card-body">
            
            <?php if($errors->any()): ?>
              <div class="alert alert-danger">
                <ul class="mb-0">
                  <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $err): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <li><?php echo e($err); ?></li>
                  <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </ul>
              </div>
            <?php endif; ?>

            <form action="<?php echo e(route('permissions.store')); ?>"
                  method="POST"
                  enctype="multipart/form-data"
                  id="formIzin">
              <?php echo csrf_field(); ?>

              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="karyawan_id">Pegawai</label>
                    <select name="karyawan_id" id="karyawan_id" class="form-control">
                      <option value="">-- Pilih Pegawai --</option>
                      <?php $__currentLoopData = $karyawans; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <option value="<?php echo e($k->id); ?>"
                          <?php echo e(old('karyawan_id')==$k->id ? 'selected':''); ?>>
                          <?php echo e($k->nip); ?> – <?php echo e($k->nama); ?>

                        </option>
                      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="permission_type">Tipe Izin</label>
                    <select name="permission_type" id="permission_type" class="form-control">
                      <option value="">-- Pilih Tipe --</option>
                      <?php $__currentLoopData = ['Cuti','Sakit','Izin Lain']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $t): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <option value="<?php echo e($t); ?>"
                          <?php echo e(old('permission_type')==$t?'selected':''); ?>>
                          <?php echo e($t); ?>

                        </option>
                      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </select>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="permission_kind">Jenis Izin</label>
                    <select name="permission_kind" id="permission_kind" class="form-control">
                      <option value="">-- Pilih Jenis --</option>
                      <?php $__currentLoopData = ['Full Day','Half Day']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $j): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <option value="<?php echo e($j); ?>"
                          <?php echo e(old('permission_kind')==$j?'selected':''); ?>>
                          <?php echo e($j); ?>

                        </option>
                      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="permission_date">Tanggal Izin</label>
                    <input type="date" name="permission_date" id="permission_date"
                           class="form-control"
                           value="<?php echo e(old('permission_date')); ?>">
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="form-group">
                    <label for="attachment">Upload Berkas (PDF/JPG/PNG)</label>
                    <input type="file" name="attachment" id="attachment"
                           class="form-control-file">
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="description">Keterangan</label>
                <textarea name="description" id="description" rows="3"
                          class="form-control"><?php echo e(old('description')); ?></textarea>
              </div>

              <button type="submit" class="btn btn-primary">
                <i class="fa fa-save"></i> Simpan
              </button>
            </form>
          </div>
        </div>

        <!-- DAFTAR IZIN -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Daftar Izin Presensi</h3>
          </div>
          <div class="card-body">
            <table id="permissionsTable"
                   class="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th>NIP</th>
                  <th>Nama</th>
                  <th>Tipe</th>
                  <th>Jenis</th>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Berkas</th>
                </tr>
              </thead>
              <tbody>
                <?php $__currentLoopData = $permissions; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $p): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                  <tr>
                    <td><?php echo e($p->nip); ?></td>
                    <td><?php echo e($p->nama); ?></td>
                    <td><?php echo e($p->permission_type); ?></td>
                    <td><?php echo e($p->permission_kind); ?></td>
                    <td><?php echo e(\Carbon\Carbon::parse($p->permission_date)->format('d-m-Y')); ?></td>
                    <td><?php echo e($p->description); ?></td>
                    <td>
                      <?php if($p->attachment): ?>
                        <a href="<?php echo e(asset('storage/'.$p->attachment)); ?>"
                           target="_blank">
                          <i class="fa fa-download"></i> Unduh
                        </a>
                      <?php else: ?>
                        -
                      <?php endif; ?>
                    </td>
                  </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
              </tbody>
            </table>
            
            <div class="mt-3">
              <?php echo e($permissions->links()); ?>

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /.content-wrapper -->
  </div>
  <!-- ./wrapper -->

  <!-- jQuery -->
  <script src="<?php echo e(asset('/plugins/jquery/jquery.min.js')); ?>"></script>
  <!-- Bootstrap 4 -->
  <script src="<?php echo e(asset('/plugins/bootstrap/js/bootstrap.bundle.min.js')); ?>"></script>
  <!-- DataTables -->
  <script src="<?php echo e(asset('/plugins/datatables/jquery.dataTables.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/datatables-responsive/js/dataTables.responsive.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/datatables-responsive/js/responsive.bootstrap4.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/datatables-buttons/js/dataTables.buttons.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/datatables-buttons/js/buttons.bootstrap4.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/jszip/jszip.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/pdfmake/pdfmake.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/pdfmake/vfs_fonts.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/datatables-buttons/js/buttons.html5.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/datatables-buttons/js/buttons.print.min.js')); ?>"></script>
  <script src="<?php echo e(asset('/plugins/datatables-buttons/js/buttons.colVis.min.js')); ?>"></script>
  <!-- AdminLTE App -->
  <script src="<?php echo e(asset('dist/js/adminlte.min.js')); ?>"></script>

  <script>
    $(function () {
      $("#permissionsTable").DataTable({
        responsive: true,
        lengthChange: true,
        autoWidth: false,
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#permissionsTable_wrapper .col-md-6:eq(0)');
    });
  </script>
</body>
</html>
<?php /**PATH C:\shuriza\rekap\rekap\resources\views/permissions/create.blade.php ENDPATH**/ ?>