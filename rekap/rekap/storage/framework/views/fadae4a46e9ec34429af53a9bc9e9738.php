

<?php $__env->startSection('content'); ?>
<div class="max-w-7xl mx-auto my-25 space-y-6">
  <div class="bg-white p-6 rounded-xl shadow border">
    <h2 class="text-xl font-bold mb-4">📝 Form New Izin Presensi</h2>

    
    <?php if(session('success')): ?>
      <div class="bg-green-100 text-green-700 p-3 rounded mb-4">
        <?php echo e(session('success')); ?>

      </div>
    <?php endif; ?>

    
    <?php if($errors->any()): ?>
      <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
        <ul class="list-disc ml-5">
          <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li><?php echo e($error); ?></li>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>
      </div>
    <?php endif; ?>

    <form action="<?php echo e(route('izin_presensi.store')); ?>" method="POST" enctype="multipart/form-data">
      <?php echo csrf_field(); ?>

      <div class="mb-4">
        <label for="karyawan_id" class="block mb-1 font-medium">Karyawan</label>
        <select id="karyawan_id" name="karyawan_id" class="border p-2 rounded w-full"></select>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label for="nip" class="block mb-1 font-medium">NIP</label>
          <input type="text" id="nip" class="border p-2 rounded w-full bg-gray-100" readonly>
        </div>
        <div>
          <label for="nama" class="block mb-1 font-medium">Nama</label>
          <input type="text" id="nama" class="border p-2 rounded w-full bg-gray-100" readonly>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label for="tipe_ijin" class="block mb-1 font-medium">Tipe Ijin</label>
          <select id="tipe_ijin" name="tipe_ijin" class="border p-2 rounded w-full">
            <?php $__currentLoopData = $tipeIjin; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $t): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <option value="<?php echo e($t); ?>"><?php echo e($t); ?></option>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </select>
        </div>
        <div>
          <label for="jenis_ijin" class="block mb-1 font-medium">Jenis Ijin</label>
          <select id="jenis_ijin" name="jenis_ijin" class="border p-2 rounded w-full">
            <?php $__currentLoopData = $listJenis; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $j): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
              <option value="<?php echo e($j); ?>"><?php echo e($j); ?></option>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label for="tanggal_awal" class="block mb-1 font-medium">Tanggal Mulai</label>
          <input type="date" name="tanggal_awal" id="tanggal_awal" class="border p-2 rounded w-full">
        </div>
        <div>
          <label for="tanggal_akhir" class="block mb-1 font-medium">Tanggal Selesai</label>
          <input type="date" name="tanggal_akhir" id="tanggal_akhir" class="border p-2 rounded w-full">
          <p class="text-sm text-gray-600">Kosongkan jika satu hari</p>
        </div>
      </div>

      <div class="mb-4">
        <label for="berkas" class="block mb-1 font-medium">Upload Berkas</label>
        <input type="file" id="berkas" name="berkas" class="border p-2 rounded w-full">
      </div>

      <div class="mb-6">
        <label for="keterangan" class="block mb-1 font-medium">Keterangan</label>
        <textarea name="keterangan" id="keterangan" class="border p-2 rounded w-full" rows="3"></textarea>
      </div>

      <div class="flex justify-between">
        <a href="<?php echo e(route('izin_presensi.index')); ?>"
           class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Batal
        </a>
        <button type="submit"
           class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Simpan
        </button>
      </div>
    </form>
  </div>
</div>
<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
  <!-- Select2 untuk pencarian karyawan -->
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/css/select2.min.css" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/js/select2.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      $('#karyawan_id').select2({
        placeholder: 'Cari karyawan...',
        width: '100%',
        ajax: {
          url: '<?php echo e(route("karyawan.search")); ?>',
          dataType: 'json',
          delay: 250,
          data: params => ({ q: params.term }),
          processResults: data => ({ results: data.results })
        }
      }).on('select2:select', e => {
        const d = e.params.data;
        document.getElementById('nip').value = d.nip;
        document.getElementById('nama').value = d.nama;
      });
    });
  </script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\shuriza\rekap\rekap\resources\views/izin_presensi/create.blade.php ENDPATH**/ ?>