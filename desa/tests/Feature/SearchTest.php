<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Memory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchTest extends TestCase
{
    use RefreshDatabase;

    /**
     * The modal groups a flat list client-side, so each hit must be a self-contained
     * object. Returning collections keyed by domain used to crash the React tree.
     */
    public function test_results_are_a_flat_list_of_navigable_hits(): void
    {
        $user = User::factory()->create();

        Event::create([
            'title' => 'Kerja Bakti Sawah',
            'slug' => 'kerja-bakti-sawah',
            'event_date' => today(),
            'location' => 'Balai Desa',
            'status' => 'published',
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/search?q=sawah')->assertOk();

        $results = $response->json('results');
        $this->assertIsArray($results);
        $this->assertArrayHasKey(0, $results, 'Results must be a flat list, not keyed by domain.');
        $this->assertSame('event', $results[0]['type']);
        $this->assertSame('/acara/kerja-bakti-sawah', $results[0]['url']);
        $this->assertSame(1, $response->json('total'));
    }

    public function test_search_spans_every_public_domain(): void
    {
        $user = User::factory()->create();

        Event::create([
            'title' => 'Festival Panen',
            'slug' => 'festival-panen',
            'event_date' => today(),
            'status' => 'published',
            'user_id' => $user->id,
        ]);
        Memory::factory()->create(['title' => 'Panen Raya 2026']);
        Destination::create([
            'name' => 'Sawah Panen',
            'slug' => 'sawah-panen',
            'category' => 'suasana',
            'status' => 'published',
            'user_id' => $user->id,
        ]);
        Announcement::create([
            'title' => 'Jadwal Panen Bersama',
            'slug' => 'jadwal-panen-bersama',
            'content' => 'Informasi panen.',
            'status' => 'published',
            'published_at' => now(),
            'user_id' => $user->id,
        ]);
        Product::create([
            'name' => 'Beras Panen Muneng',
            'slug' => 'beras-panen-muneng',
            'category' => 'pertanian',
            'contact_name' => 'Pak Darmo',
            'status' => 'published',
        ]);

        $types = collect($this->getJson('/api/search?q=panen')->assertOk()->json('results'))
            ->pluck('type')
            ->unique()
            ->sort()
            ->values()
            ->all();

        $this->assertSame(['berita', 'destinasi', 'event', 'kenangan', 'umkm'], $types);
    }

    public function test_unpublished_and_unapproved_content_stays_hidden(): void
    {
        $user = User::factory()->create();

        Event::create([
            'title' => 'Rapat Rahasia',
            'slug' => 'rapat-rahasia',
            'event_date' => today(),
            'status' => 'draft',
            'user_id' => $user->id,
        ]);
        Memory::factory()->pending()->create(['title' => 'Rahasia Menunggu']);

        $this->getJson('/api/search?q=rahasia')
            ->assertOk()
            ->assertJson(['results' => [], 'total' => 0]);
    }

    public function test_queries_shorter_than_two_characters_return_nothing(): void
    {
        Memory::factory()->create(['title' => 'Panen']);

        $this->getJson('/api/search?q=p')
            ->assertOk()
            ->assertJson(['results' => [], 'total' => 0]);
    }

    public function test_excerpts_are_plain_text(): void
    {
        $user = User::factory()->create();

        Announcement::create([
            'title' => 'Pengumuman Posyandu',
            'slug' => 'pengumuman-posyandu',
            'content' => '<p>Posyandu <strong>balita</strong> digelar Rabu.</p>',
            'status' => 'published',
            'published_at' => now(),
            'user_id' => $user->id,
        ]);

        $excerpt = $this->getJson('/api/search?q=posyandu')->assertOk()->json('results.0.excerpt');

        $this->assertStringNotContainsString('<', $excerpt);
        $this->assertStringContainsString('balita', $excerpt);
    }
}
