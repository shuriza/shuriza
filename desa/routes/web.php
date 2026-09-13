<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\EventController;
use App\Http\Controllers\Public\MemoryController;
use App\Http\Controllers\Public\DestinationController;
use App\Http\Controllers\Public\ProfileDesaController;
use App\Http\Controllers\Public\AnnouncementController;
use App\Http\Controllers\Public\SubmissionController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\MemoryController as AdminMemoryController;
use App\Http\Controllers\Admin\DestinationController as AdminDestinationController;
use App\Http\Controllers\Admin\AnnouncementController as AdminAnnouncementController;
use App\Http\Controllers\Admin\SubmissionController as AdminSubmissionController;
use App\Http\Controllers\Admin\VillageInfoController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\PollController as AdminPollController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\CommentController as AdminCommentController;
use App\Http\Controllers\Public\ProductController;
use App\Http\Controllers\Public\MapController;
use App\Http\Controllers\Public\UserDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\PollController as PollVoteController;
use App\Http\Controllers\Api\ReactionController;
use App\Http\Controllers\Api\ScraperController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/profil-desa', [ProfileDesaController::class, 'index'])->name('profil-desa');
Route::get('/acara', [EventController::class, 'index'])->name('events.index');
Route::get('/acara/{slug}', [EventController::class, 'show'])->name('events.show');
Route::get('/kenangan', [MemoryController::class, 'index'])->name('memories.index');
Route::get('/kenangan/{memory}', [MemoryController::class, 'show'])->whereNumber('memory')->name('memories.show');
Route::get('/destinasi', [DestinationController::class, 'index'])->name('destinations.index');
Route::get('/destinasi/{slug}', [DestinationController::class, 'show'])->name('destinations.show');
Route::get('/berita', [AnnouncementController::class, 'index'])->name('announcements.index');
Route::get('/berita/{slug}', [AnnouncementController::class, 'show'])->name('announcements.show');
Route::get('/galeri', [GalleryController::class, 'index'])->name('gallery.index');
Route::get('/kontak', [ContactController::class, 'index'])->name('contact.index');
Route::post('/kontak', [ContactController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('contact.store');

// Peta (Map)
Route::get('/peta', [MapController::class, 'index'])->name('map.index');

// Sitemap
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Public Submission (no auth required)
Route::post('/submissions', [SubmissionController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('submissions.store');

// UMKM / Products (no auth required)
Route::get('/umkm', [ProductController::class, 'index'])->name('products.index');
Route::get('/umkm/submit', [ProductController::class, 'create'])->name('products.create');
Route::post('/umkm/submit', [ProductController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('products.store');
Route::get('/umkm/{slug}', [ProductController::class, 'show'])->name('products.show');

/*
|--------------------------------------------------------------------------
| First-party SPA endpoints
|--------------------------------------------------------------------------
|
| These are consumed exclusively by same-origin XHR from Inertia pages, so they
| belong on the web stack: they need the session (reactions and poll votes are
| identified by session id) and they need CSRF protection (authenticated writes
| are authorised by the session cookie). The stateless `api` middleware group
| provides neither.
|
*/
Route::prefix('api')->name('api.')->group(function () {
    Route::get('/search', [SearchController::class, 'search'])->name('search');
    Route::get('/comments/{type}/{id}', [CommentController::class, 'index'])->name('comments.index');

    // Session-identified, so unauthenticated — throttled instead.
    Route::post('/reactions/toggle', [ReactionController::class, 'toggle'])
        ->middleware('throttle:60,1')
        ->name('reactions.toggle');
    Route::get('/reactions/counts', [ReactionController::class, 'getCounts'])->name('reactions.counts');

    Route::post('/polls/{poll}/vote', [PollVoteController::class, 'vote'])
        ->middleware('throttle:20,1')
        ->name('polls.vote');

    Route::middleware('auth')->group(function () {
        Route::post('/scrape/preview', [ScraperController::class, 'preview'])->name('scrape.preview');
        Route::post('/likes/toggle', [LikeController::class, 'toggle'])->name('likes.toggle');
        Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    });

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::post('/scrape/batch', [ScraperController::class, 'batchScrape'])->name('scrape.batch');
    });
});

// Authenticated Warga Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard-saya', [UserDashboardController::class, 'index'])->name('user.dashboard');

    Route::get('/kenangan/submit', [MemoryController::class, 'create'])->name('memories.create');
    Route::post('/kenangan/submit', [MemoryController::class, 'store'])->name('memories.store');
    Route::post('/kenangan/preview', [MemoryController::class, 'preview'])->name('memories.preview');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Events
    Route::resource('events', AdminEventController::class);

    // Memories
    Route::get('/memories', [AdminMemoryController::class, 'index'])->name('memories.index');
    Route::post('/memories/{memory}/approve', [AdminMemoryController::class, 'approve'])->name('memories.approve');
    Route::post('/memories/{memory}/reject', [AdminMemoryController::class, 'reject'])->name('memories.reject');
    Route::delete('/memories/{memory}', [AdminMemoryController::class, 'destroy'])->name('memories.destroy');

    // Destinations
    Route::resource('destinations', AdminDestinationController::class);

    // Announcements
    Route::resource('announcements', AdminAnnouncementController::class);

    // Submissions
    Route::get('/submissions', [AdminSubmissionController::class, 'index'])->name('submissions.index');
    Route::post('/submissions/{submission}/approve', [AdminSubmissionController::class, 'approve'])->name('submissions.approve');
    Route::post('/submissions/{submission}/reject', [AdminSubmissionController::class, 'reject'])->name('submissions.reject');
    Route::delete('/submissions/{submission}', [AdminSubmissionController::class, 'destroy'])->name('submissions.destroy');

    // Products / UMKM
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::post('/products/{product}/approve', [AdminProductController::class, 'approve'])->name('products.approve');
    Route::post('/products/{product}/reject', [AdminProductController::class, 'reject'])->name('products.reject');
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');

    // Village Info
    Route::get('/village-info', [VillageInfoController::class, 'index'])->name('village-info.index');
    Route::put('/village-info', [VillageInfoController::class, 'update'])->name('village-info.update');
    Route::post('/village-info', [VillageInfoController::class, 'store'])->name('village-info.store');
    Route::delete('/village-info/{villageInfo}', [VillageInfoController::class, 'destroy'])->name('village-info.destroy');

    // Gallery
    Route::get('/gallery', [AdminGalleryController::class, 'index'])->name('gallery.index');
    Route::post('/gallery', [AdminGalleryController::class, 'store'])->name('gallery.store');
    Route::delete('/gallery/{galleryPhoto}', [AdminGalleryController::class, 'destroy'])->name('gallery.destroy');

    // Polls
    Route::get('/polls', [AdminPollController::class, 'index'])->name('polls.index');
    Route::post('/polls', [AdminPollController::class, 'store'])->name('polls.store');
    Route::post('/polls/{poll}/toggle', [AdminPollController::class, 'toggleActive'])->name('polls.toggle');
    Route::delete('/polls/{poll}', [AdminPollController::class, 'destroy'])->name('polls.destroy');

    // Contact messages
    Route::get('/contacts', [AdminContactMessageController::class, 'index'])->name('contacts.index');
    Route::post('/contacts/{contactMessage}/read', [AdminContactMessageController::class, 'markRead'])->name('contacts.read');
    Route::post('/contacts/{contactMessage}/archive', [AdminContactMessageController::class, 'archive'])->name('contacts.archive');
    Route::delete('/contacts/{contactMessage}', [AdminContactMessageController::class, 'destroy'])->name('contacts.destroy');

    // Comment moderation
    Route::get('/comments', [AdminCommentController::class, 'index'])->name('comments.index');
    Route::post('/comments/{comment}/hide', [AdminCommentController::class, 'hide'])->name('comments.hide');
    Route::post('/comments/{comment}/restore', [AdminCommentController::class, 'restore'])->name('comments.restore');
    Route::delete('/comments/{comment}', [AdminCommentController::class, 'destroy'])->name('comments.destroy');
});

require __DIR__.'/auth.php';
