<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Desa Muneng',
            'email' => 'admin@desamuneng.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Warga Muneng',
            'email' => 'warga@desamuneng.id',
            'password' => Hash::make('password'),
            'role' => 'warga',
            'email_verified_at' => now(),
        ]);
    }
}
