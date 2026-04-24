

<?php $__env->startSection('content'); ?>
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-10">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Daftar Izin Presensi</h4>
        <a href="<?php echo e(route('izin_presensi.create')); ?>" class="btn btn-success">+ Baru</a>
      </div>

      <div class="card shadow-sm rounded">
        <div class="card-body p-0">
          <div class="table-responsive">
            
            <table class="table table-hover table-bordered table-fixed align-middle mb-0">
              <colgroup>
                <col style="width:5%">
                <col style="width:20%">
                <col style="width:10%">
                <col style="width:15%">
                <col style="width:15%">
                <col style="width:10%">
                <col style="width:15%">
                <col style="width:10%">
              </colgroup>
              <thead class="table-light text-center">
                <tr>
                  <th>#</th>
                  <th>Karyawan</th>
                  <th>Tipe</th>
                  <th>Periode</th>
                  <th>Jenis</th>
                  <th>Berkas</th>
                  <th>Keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <?php $__empty_1 = true; $__currentLoopData = $data; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $i => $izin): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                <tr>
                  <td class="text-center"><?php echo e($data->firstItem() + $i); ?></td>
                  
                  <td class="text-start">
                    <?php echo e($izin->karyawan->nama); ?><br>
                    <small><?php echo e($izin->karyawan->nip); ?></small>
                  </td>
                  <td class="text-center"><?php echo e($izin->tipe_ijin); ?></td>
                  <td class="text-center">
                    <?php echo e($izin->tanggal_awal->format('d-m-Y')); ?>

                    <?php if($izin->tanggal_akhir): ?>–<?php echo e($izin->tanggal_akhir->format('d-m-Y')); ?><?php endif; ?>
                  </td>
                  <td class="text-center"><?php echo e($izin->jenis_ijin); ?></td>
                  <td class="text-center">
                    <?php if($izin->berkas): ?>
                      <a href="<?php echo e(Storage::url($izin->berkas)); ?>" target="_blank">Lihat</a>
                    <?php else: ?>
                      -
                    <?php endif; ?>
                  </td>
                  <td class="text-center"><?php echo e($izin->keterangan ?? '-'); ?></td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" disabled>Hapus</button>
                  </td>
                </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                <tr>
                  <td colspan="8" class="text-center py-4">Belum ada data.</td>
                </tr>
                <?php endif; ?>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer text-center">
          <?php echo e($data->links()); ?>

        </div>
      </div>
    </div>
  </div>
</div>


<?php $__env->startPush('styles'); ?>
<style>
.table-fixed {
  table-layout: fixed;
  width: 100%;
}
.table-fixed th,
.table-fixed td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<?php $__env->stopPush(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\shuriza\rekap\rekap\resources\views/izin_presensi/index.blade.php ENDPATH**/ ?>