
<?php $__env->startSection('title', 'Home'); ?>

<?php $__env->startSection('content'); ?>
  <div class="text-center mt-12">
    <h1 class="text-2xl font-bold text-green-700">Selamat Datang</h1>
    <h2 class="text-xl font-semibold text-green-500 mb-6">Dinas Ketahanan Pangan dan Pertanian Kediri
    </h2>

    <div class="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto text-justify">
      <p class="text-gray-800 mb-4">
        Dinas Ketahanan Pangan dan Pertanian Kediri memiliki komitmen dalam memastikan ketahanan
        pangan serta mendukung sektor pertanian yang berkelanjutan di Kota Kediri. Kami menyediakan
        informasi terkait kegiatan, kebijakan, dan berbagai inisiatif untuk meningkatkan kualitas
        hidup masyarakat melalui sektor pangan dan pertanian.
      </p>
      <p class="text-gray-800">
        Kami berupaya untuk memperkuat ketahanan pangan lokal melalui berbagai program yang dapat
        diakses masyarakat, baik itu melalui penyuluhan, pelatihan, maupun penyediaan data yang
        akurat.
      </p>
    </div>
  </div>
  <div class="max-w-5xl mx-auto py-8 mt-12">
    <h2 class="text-2xl font-bold text-green-700 mb-4 text-center">Berita Terbaru</h2>

    <form method="get" class="flex justify-center mb-6">
      <input type="text" name="search" placeholder="Cari Berita"
        class="border rounded-l px-3 py-2 w-72" value="<?php echo e(request('search')); ?>">
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700">
        Cari Berita
      </button>
    </form>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <?php $__empty_1 = true; $__currentLoopData = $beritas; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $b): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="relative">
            <?php if($b->image): ?>
              <img src="<?php echo e(asset('storage/' . $b->image)); ?>" class="w-full h-40 object-cover">
            <?php else: ?>
              <div class="w-full h-40 bg-gray-200"></div>
            <?php endif; ?>
            <span class="absolute top-2 left-2 bg-green-600 text-white text-sm px-2 py-1 rounded">
              <?php echo e($b->published_at->format('d M')); ?>

            </span>
          </div>
          <div class="p-4">
            <h3 class="font-semibold mb-2 line-clamp-2"><?php echo e($b->title); ?></h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3">
              <?php echo e($b->excerpt); ?>

            </p>
            <a href="<?php echo e(route('berita.show', $b->id)); ?>"
              class="text-green-600 hover:underline text-sm">Baca selengkapnya</a>
          </div>
        </div>
      <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
        <p class="col-span-full text-center text-gray-500">Belum ada berita.</p>
      <?php endif; ?>
    </div>

    <div class="mt-6">
      <?php echo e($beritas->links()); ?>

    </div>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/guest/home.blade.php ENDPATH**/ ?>