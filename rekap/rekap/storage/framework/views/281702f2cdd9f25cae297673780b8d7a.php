


<?php $__env->startSection('title', 'Detail Berita'); ?>

<?php $__env->startSection('content'); ?>
  <div class="max-w-5xl mx-auto py-8">
    <h2 class="text-3xl font-semibold text-green-700 mb-6 text-center"><?php echo e($berita->title); ?></h2>

    <?php if($berita->image): ?>
      <img src="<?php echo e(asset('storage/' . $berita->image)); ?>" class="w-full h-80 object-cover mb-4">
    <?php else: ?>
      <div class="w-full h-80 bg-gray-200 mb-4"></div>
    <?php endif; ?>

    <p class="text-sm text-gray-600 mb-4">Published on: <?php echo e($berita->published_at->format('d M Y')); ?>

    </p>

    <div class="prose lg:prose-xl">
      <?php echo $berita->content; ?>

    </div>

    <div class="mt-6">
      <a href="<?php echo e(route('home')); ?>" class="text-blue-600 hover:underline">
        Kembali ke daftar berita
      </a>
    </div>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/guest/berita_detail.blade.php ENDPATH**/ ?>