<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\Destination;
use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Detail pages render a like button and comment thread. When the controller omitted
 * `likes_count` / `is_liked` / `comments`, or named the related list differently than the
 * page expected, React threw during render and the page went completely blank while the
 * HTTP status stayed 200 — so status-code checks alone cannot catch these.
 */
class DetailPageContractTest extends TestCase
{
    use RefreshDatabase;

    private function author(): User
    {
        return User::factory()->create();
    }

    public function test_announcement_detail_supplies_interaction_props(): void
    {
        $author = $this->author();

        Announcement::create([
            'title' => 'Kerja Bakti Minggu Ini',
            'slug' => 'kerja-bakti-minggu-ini',
            'content' => '<p>Mari ikut serta.</p>',
            'status' => 'published',
            'published_at' => now(),
            'user_id' => $author->id,
        ]);

        Announcement::create([
            'title' => 'Berita Lain',
            'slug' => 'berita-lain',
            'content' => 'Isi.',
            'status' => 'published',
            'published_at' => now()->subDay(),
            'user_id' => $author->id,
        ]);

        $this->get('/berita/kerja-bakti-minggu-ini')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Announcements/Show')
                ->where('announcement.likes_count', 0)
                ->where('announcement.is_liked', false)
                ->has('announcement.comments')
                ->has('relatedAnnouncements', 1)
            );
    }

    public function test_event_detail_supplies_interaction_props_and_category_object(): void
    {
        $author = $this->author();
        $category = Category::create([
            'name' => 'Gotong Royong',
            'slug' => 'gotong-royong',
            'type' => 'event',
        ]);

        Event::create([
            'title' => 'Bersih Sungai',
            'slug' => 'bersih-sungai',
            'event_date' => today(),
            'status' => 'published',
            'category_id' => $category->id,
            'user_id' => $author->id,
        ]);

        $this->get('/acara/bersih-sungai')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Events/Show')
                ->where('event.likes_count', 0)
                ->where('event.is_liked', false)
                ->has('event.comments')
                // The page reads `category.name`; a bare string would crash it.
                ->where('event.category.name', 'Gotong Royong')
            );
    }

    public function test_destination_detail_supplies_interaction_props(): void
    {
        $author = $this->author();

        Destination::create([
            'name' => 'Balai Desa',
            'slug' => 'balai-desa',
            'description' => 'Pusat kegiatan warga.',
            'category' => 'fasilitas',
            'status' => 'published',
            'user_id' => $author->id,
        ]);

        $this->get('/destinasi/balai-desa')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Destinations/Show')
                ->where('destination.likes_count', 0)
                ->where('destination.is_liked', false)
                ->has('destination.comments')
            );
    }

    public function test_a_signed_in_users_own_like_is_reflected(): void
    {
        $author = $this->author();

        $announcement = Announcement::create([
            'title' => 'Pengumuman Disukai',
            'slug' => 'pengumuman-disukai',
            'content' => 'Isi.',
            'status' => 'published',
            'published_at' => now(),
            'user_id' => $author->id,
        ]);

        $this->actingAs($author)
            ->postJson('/api/likes/toggle', [
                'likeable_type' => 'announcement',
                'likeable_id' => $announcement->id,
            ])
            ->assertOk();

        $this->actingAs($author)
            ->get('/berita/pengumuman-disukai')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('announcement.likes_count', 1)
                ->where('announcement.is_liked', true)
            );
    }

    public function test_hidden_comments_are_withheld_from_the_public_page(): void
    {
        $author = $this->author();

        $announcement = Announcement::create([
            'title' => 'Moderasi Komentar',
            'slug' => 'moderasi-komentar',
            'content' => 'Isi.',
            'status' => 'published',
            'published_at' => now(),
            'user_id' => $author->id,
        ]);

        $announcement->comments()->create([
            'user_id' => $author->id,
            'content' => 'Komentar tampil.',
            'status' => 'active',
        ]);
        $announcement->comments()->create([
            'user_id' => $author->id,
            'content' => 'Komentar disembunyikan.',
            'status' => 'hidden',
        ]);

        $this->get('/berita/moderasi-komentar')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('announcement.comments', 1)
                ->where('announcement.comments.0.content', 'Komentar tampil.')
            );
    }
}
