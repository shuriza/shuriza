<?php

namespace Tests\Feature;

use App\Models\Memory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MemoryDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_approved_memory_detail_page_is_reachable(): void
    {
        $memory = Memory::factory()->create(['title' => 'Kerja Bakti 2026']);

        $this->get("/kenangan/{$memory->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Memories/Show')
                ->where('memory.title', 'Kerja Bakti 2026')
            );
    }

    public function test_unapproved_memories_are_not_publicly_visible(): void
    {
        $pending = Memory::factory()->pending()->create();
        $rejected = Memory::factory()->rejected()->create();

        $this->get("/kenangan/{$pending->id}")->assertNotFound();
        $this->get("/kenangan/{$rejected->id}")->assertNotFound();
    }

    public function test_detail_page_excludes_itself_from_related_memories(): void
    {
        $memory = Memory::factory()->create();
        Memory::factory()->count(2)->create();

        $this->get("/kenangan/{$memory->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('related', 2)
                ->where('related.0.id', fn ($id) => $id !== $memory->id)
                ->where('related.1.id', fn ($id) => $id !== $memory->id)
            );
    }

    public function test_submit_page_is_reachable_for_verified_warga(): void
    {
        $user = User::factory()->create(['role' => 'warga']);

        $this->actingAs($user)
            ->get('/kenangan/submit')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Public/Memories/Create'));
    }
}
