<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicHomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_only_lists_events_from_today_onward(): void
    {
        $user = User::factory()->create();

        Event::create([
            'title' => 'Agenda Lama',
            'slug' => 'agenda-lama',
            'event_date' => today()->subDay(),
            'status' => 'published',
            'user_id' => $user->id,
        ]);

        Event::create([
            'title' => 'Agenda Hari Ini',
            'slug' => 'agenda-hari-ini',
            'event_date' => today(),
            'status' => 'published',
            'user_id' => $user->id,
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Home')
                ->has('upcomingEvents', 1)
                ->where('upcomingEvents.0.title', 'Agenda Hari Ini')
            );
    }
}
