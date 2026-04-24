
<?php $__env->startSection('title', 'Edit Berita'); ?>

<?php $__env->startSection('content'); ?>
  <div class="bg-white p-6 rounded shadow max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Edit Berita</h1>

    <?php if($errors->any()): ?>
      <div class="bg-red-100 text-red-700 p-2 mb-4 rounded">
        <ul class="list-disc list-inside">
          <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $e): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <li><?php echo e($e); ?></li>
          <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>
      </div>
    <?php endif; ?>

    <form action="<?php echo e(route('admin.berita.update', $berita->id)); ?>" method="POST"
      enctype="multipart/form-data">
      <?php echo csrf_field(); ?>
      <?php echo method_field('PUT'); ?>

      <div class="mb-4">
        <label for="title" class="block font-medium">Judul</label>
        <input type="text" id="title" name="title" value="<?php echo e(old('title', $berita->title)); ?>"
          class="border p-2 w-full" required>
      </div>

      <div class="mb-4">
        <label for="excerpt" class="block font-medium">Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows="2" class="border p-2 w-full"><?php echo e(old('excerpt', $berita->excerpt)); ?></textarea>
      </div>

      <div class="mb-4">
        <label for="content" class="block font-medium">Konten</label>
        <textarea id="content" name="content" rows="6" class="border p-2 w-full" required><?php echo e(old('content', $berita->content)); ?></textarea>
      </div>

      <div class="mb-4">
        <label for="published_at" class="block font-medium">Tanggal Terbit</label>
        <input type="date" id="published_at" name="published_at"
          value="<?php echo e(old('published_at', $berita->published_at->format('Y-m-d'))); ?>" class="border p-2"
          required>
      </div>

      <div class="mb-4">
        <label for="image" class="block font-medium">Gambar (opsional)</label>
        <input type="file" id="image" name="image" class="border p-1" accept="image/*">
        <?php if($berita->image): ?>
          <div class="mt-2">
            <p class="text-sm text-gray-600 mb-1">Gambar saat ini:</p>
            <img src="<?php echo e(asset('storage/' . $berita->image)); ?>" class="w-32 h-20 object-cover rounded"
              alt="Gambar Berita">
          </div>
        <?php endif; ?>
      </div>

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Update
      </button>
    </form>
  </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\laragon\www\dkpp\resources\views/admin/visual_edit.blade.php ENDPATH**/ ?>