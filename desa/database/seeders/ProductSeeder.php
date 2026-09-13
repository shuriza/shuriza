<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Keripik Singkong Bu Sari',
                'slug' => 'keripik-singkong-bu-sari',
                'description' => 'Keripik singkong renyah dengan bumbu rahasia khas Desa Muneng. Tersedia rasa original, balado, dan keju. Dibuat dari singkong pilihan hasil panen warga.',
                'price' => 15000,
                'price_note' => 'per bungkus',
                'category' => 'makanan',
                'image' => null,
                'contact_name' => 'Bu Sari',
                'contact_phone' => '081234567890',
                'contact_whatsapp' => '081234567890',
                'is_available' => true,
                'status' => 'published',
                'user_id' => null,
                'submitted_by_name' => 'Bu Sari',
            ],
            [
                'name' => 'Kopi Bubuk Muneng',
                'slug' => 'kopi-bubuk-muneng',
                'description' => 'Kopi bubuk asli dari biji kopi pilihan yang ditanam di lereng sekitar Kediri. Diproses secara tradisional untuk menghasilkan aroma dan rasa yang khas.',
                'price' => 25000,
                'price_note' => 'per 250gr',
                'category' => 'minuman',
                'image' => null,
                'contact_name' => 'Pak Joko',
                'contact_phone' => '081345678901',
                'contact_whatsapp' => '081345678901',
                'is_available' => true,
                'status' => 'published',
                'user_id' => null,
                'submitted_by_name' => 'Pak Joko',
            ],
            [
                'name' => 'Anyaman Bambu Pak Darmo',
                'slug' => 'anyaman-bambu-pak-darmo',
                'description' => 'Kerajinan anyaman bambu buatan tangan. Tersedia berbagai bentuk: tampah, besek, keranjang, dan hiasan dinding. Cocok untuk souvenir atau dekorasi rumah.',
                'price' => 50000,
                'price_note' => null,
                'category' => 'kerajinan',
                'image' => null,
                'contact_name' => 'Pak Darmo',
                'contact_phone' => '081456789012',
                'contact_whatsapp' => '081456789012',
                'is_available' => true,
                'status' => 'published',
                'user_id' => null,
                'submitted_by_name' => 'Pak Darmo',
            ],
            [
                'name' => 'Beras Organik Muneng',
                'slug' => 'beras-organik-muneng',
                'description' => 'Beras organik berkualitas tinggi dari sawah Desa Muneng. Ditanam tanpa pestisida kimia, menggunakan pupuk organik alami. Pulen dan wangi.',
                'price' => 65000,
                'price_note' => 'per 5kg',
                'category' => 'pertanian',
                'image' => null,
                'contact_name' => 'Kelompok Tani Makmur',
                'contact_phone' => '081567890123',
                'contact_whatsapp' => '081567890123',
                'is_available' => true,
                'status' => 'published',
                'user_id' => null,
                'submitted_by_name' => 'Kelompok Tani Makmur',
            ],
            [
                'name' => 'Jasa Jahit Bu Ning',
                'slug' => 'jasa-jahit-bu-ning',
                'description' => 'Menerima jahitan pakaian wanita, pria, dan anak-anak. Bisa permak, bikin baru, atau seragam. Pengerjaan rapi dan tepat waktu.',
                'price' => null,
                'price_note' => 'Hubungi langsung',
                'category' => 'jasa',
                'image' => null,
                'contact_name' => 'Bu Ning',
                'contact_phone' => '081678901234',
                'contact_whatsapp' => '081678901234',
                'is_available' => true,
                'status' => 'published',
                'user_id' => null,
                'submitted_by_name' => 'Bu Ning',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
