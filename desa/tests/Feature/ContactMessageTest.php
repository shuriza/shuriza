<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_persists_the_message(): void
    {
        $this->post('/kontak', [
            'name' => 'Sari',
            'email' => 'sari@example.test',
            'subject' => 'Usulan perbaikan jalan',
            'message' => 'Mohon jalan depan balai desa diperbaiki.',
        ])->assertRedirect();

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'sari@example.test',
            'subject' => 'Usulan perbaikan jalan',
            'status' => 'unread',
        ]);
    }

    public function test_honeypot_submission_is_rejected_and_not_stored(): void
    {
        $this->post('/kontak', [
            'name' => 'Bot',
            'email' => 'bot@example.test',
            'subject' => 'spam',
            'message' => 'spam body',
            'website' => 'http://spam.example',
        ])->assertSessionHasErrors('website');

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_admin_can_list_messages_but_warga_cannot(): void
    {
        ContactMessage::factory()->create();

        $warga = User::factory()->create(['role' => 'warga']);
        $this->actingAs($warga)->get('/admin/contacts')->assertForbidden();

        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)->get('/admin/contacts')->assertOk();
    }

    public function test_marking_a_message_read_records_the_timestamp(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $message = ContactMessage::factory()->create();

        $this->actingAs($admin)
            ->post("/admin/contacts/{$message->id}/read")
            ->assertRedirect();

        $message->refresh();
        $this->assertSame('read', $message->status);
        $this->assertNotNull($message->read_at);
    }

    public function test_status_filter_narrows_the_listing(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        ContactMessage::factory()->create(['subject' => 'Pesan baru']);
        ContactMessage::factory()->archived()->create(['subject' => 'Pesan lama']);

        $this->actingAs($admin)
            ->get('/admin/contacts?status=archived')
            ->assertOk()
            ->assertSee('Pesan lama')
            ->assertDontSee('Pesan baru');
    }
}
