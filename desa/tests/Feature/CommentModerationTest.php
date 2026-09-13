<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CommentModerationTest extends TestCase
{
    use RefreshDatabase;

    private function comment(string $content = 'Komentar warga.', string $status = 'active'): Comment
    {
        $author = User::factory()->create(['role' => 'warga']);

        $announcement = Announcement::create([
            'title' => 'Pengumuman Uji',
            'slug' => 'pengumuman-uji-'.uniqid(),
            'content' => 'Isi.',
            'status' => 'published',
            'published_at' => now(),
            'user_id' => $author->id,
        ]);

        return $announcement->comments()->create([
            'user_id' => $author->id,
            'content' => $content,
            'status' => $status,
        ]);
    }

    public function test_only_admins_reach_the_moderation_queue(): void
    {
        $this->comment();

        $this->get('/admin/comments')->assertRedirect('/login');

        $warga = User::factory()->create(['role' => 'warga']);
        $this->actingAs($warga)->get('/admin/comments')->assertForbidden();

        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)->get('/admin/comments')->assertOk();
    }

    /**
     * `commentable` spans four models with different title columns and URL shapes, so the
     * controller flattens it. A regression here would blank the page.
     */
    public function test_queue_flattens_the_polymorphic_subject(): void
    {
        $comment = $this->comment('Terima kasih infonya.');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/admin/comments')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Comments/Index')
                ->where('comments.data.0.content', 'Terima kasih infonya.')
                ->where('comments.data.0.subject.type', 'announcement')
                ->where('comments.data.0.subject.label', 'Berita')
                ->where('comments.data.0.subject.title', 'Pengumuman Uji')
                ->where('comments.data.0.subject.url', '/berita/'.$comment->commentable->slug)
            );
    }

    public function test_admin_can_hide_and_restore_a_comment(): void
    {
        $comment = $this->comment();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->post("/admin/comments/{$comment->id}/hide")->assertRedirect();
        $this->assertSame('hidden', $comment->fresh()->status);

        $this->actingAs($admin)->post("/admin/comments/{$comment->id}/restore")->assertRedirect();
        $this->assertSame('active', $comment->fresh()->status);
    }

    public function test_admin_can_delete_a_comment(): void
    {
        $comment = $this->comment();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->delete("/admin/comments/{$comment->id}")->assertRedirect();
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_status_filter_narrows_the_queue(): void
    {
        $this->comment('Komentar tampil.');
        $this->comment('Komentar tersembunyi.', 'hidden');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/admin/comments?status=hidden')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('comments.data', 1)
                ->where('comments.data.0.content', 'Komentar tersembunyi.')
                ->where('hiddenCount', 1)
            );
    }

    public function test_a_hidden_comment_disappears_from_the_public_api(): void
    {
        $comment = $this->comment();
        $admin = User::factory()->create(['role' => 'admin']);
        $slugId = $comment->commentable_id;

        $this->getJson("/api/comments/announcement/{$slugId}")
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->actingAs($admin)->post("/admin/comments/{$comment->id}/hide");

        $this->getJson("/api/comments/announcement/{$slugId}")
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
