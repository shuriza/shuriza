<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Memory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Relations\Relation;
use Tests\TestCase;

class SpaEndpointTest extends TestCase
{
    use RefreshDatabase;

    public function test_reaction_counts_endpoint_has_a_session_available(): void
    {
        $memory = Memory::factory()->create();

        $this->getJson("/api/reactions/counts?reactable_type=memory&reactable_id={$memory->id}")
            ->assertOk()
            ->assertJsonStructure(['counts', 'userReactions']);
    }

    public function test_anonymous_visitor_can_react_without_logging_in(): void
    {
        $memory = Memory::factory()->create();

        $this->postJson('/api/reactions/toggle', [
            'emoji' => 'heart',
            'reactable_type' => 'memory',
            'reactable_id' => $memory->id,
        ])
            ->assertOk()
            ->assertJson(['reacted' => true, 'counts' => ['heart' => 1]]);

        // Reactions are scoped to the visitor's session rather than an account.
        $this->assertDatabaseHas('reactions', [
            'reactable_type' => 'memory',
            'reactable_id' => $memory->id,
            'emoji' => 'heart',
            'user_id' => null,
        ]);
    }

    /**
     * `*_type` columns must hold the short morph alias, not a fully-qualified class name,
     * so the data survives a namespace or class rename.
     */
    public function test_polymorphic_columns_store_morph_aliases(): void
    {
        $memory = Memory::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/likes/toggle', [
            'likeable_type' => 'memory',
            'likeable_id' => $memory->id,
        ])->assertOk();

        $this->actingAs($user)->postJson('/api/comments', [
            'commentable_type' => 'memory',
            'commentable_id' => $memory->id,
            'content' => 'Kenangan yang indah.',
        ])->assertCreated();

        $this->assertDatabaseHas('likes', ['likeable_type' => 'memory']);
        $this->assertDatabaseHas('comments', ['commentable_type' => 'memory']);
        $this->assertSame(Memory::class, Relation::getMorphedModel('memory'));

        // The relation must still resolve back to a real model.
        $this->assertTrue($memory->comments()->exists());
        $this->assertSame(1, $memory->likes()->count());
    }

    public function test_an_unmapped_morph_type_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/comments', [
            'commentable_type' => 'product',
            'commentable_id' => 1,
            'content' => 'Tidak didukung.',
        ])->assertUnprocessable();
    }

    public function test_reaction_toggle_rejects_an_unsupported_emoji(): void
    {
        $memory = Memory::factory()->create();

        $this->postJson('/api/reactions/toggle', [
            'emoji' => 'poop',
            'reactable_type' => 'memory',
            'reactable_id' => $memory->id,
        ])->assertUnprocessable();
    }

    public function test_like_toggle_requires_authentication(): void
    {
        $memory = Memory::factory()->create();

        $this->postJson('/api/likes/toggle', [
            'likeable_type' => 'memory',
            'likeable_id' => $memory->id,
        ])->assertUnauthorized();
    }

    public function test_authenticated_user_can_toggle_a_like(): void
    {
        $memory = Memory::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/likes/toggle', [
                'likeable_type' => 'memory',
                'likeable_id' => $memory->id,
            ])
            ->assertOk()
            ->assertJson(['liked' => true, 'count' => 1]);
    }

    public function test_admin_can_delete_another_users_comment(): void
    {
        $author = User::factory()->create(['role' => 'warga']);
        $admin = User::factory()->create(['role' => 'admin']);
        $memory = Memory::factory()->create();

        $comment = Comment::create([
            'user_id' => $author->id,
            'commentable_type' => 'memory',
            'commentable_id' => $memory->id,
            'content' => 'Kenangan yang indah.',
            'status' => 'active',
        ]);

        $this->actingAs($admin)
            ->deleteJson("/api/comments/{$comment->id}")
            ->assertOk();

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_unrelated_user_cannot_delete_someone_elses_comment(): void
    {
        $author = User::factory()->create(['role' => 'warga']);
        $other = User::factory()->create(['role' => 'warga']);
        $memory = Memory::factory()->create();

        $comment = Comment::create([
            'user_id' => $author->id,
            'commentable_type' => 'memory',
            'commentable_id' => $memory->id,
            'content' => 'Kenangan yang indah.',
            'status' => 'active',
        ]);

        $this->actingAs($other)
            ->deleteJson("/api/comments/{$comment->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }
}
