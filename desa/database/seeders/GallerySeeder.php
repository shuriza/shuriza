<?php

namespace Database\Seeders;

use App\Models\GalleryPhoto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $photos = [
            [
                'title' => 'Pemandangan Sawah Desa Muneng',
                'description' => 'Hamparan sawah hijau yang menjadi ciri khas Desa Muneng.',
                'image_path' => 'gallery/sawah-desa.jpg',
                'album' => 'Suasana Desa',
                'status' => 'published',
                'is_featured' => true,
                'tone' => [132, 204, 22],
            ],
            [
                'title' => 'Jalan Utama Desa',
                'description' => 'Jalan utama desa yang asri dan teduh.',
                'image_path' => 'gallery/jalan-desa.jpg',
                'album' => 'Suasana Desa',
                'status' => 'published',
                'is_featured' => false,
                'tone' => [16, 185, 129],
            ],
            [
                'title' => 'Gotong Royong Warga',
                'description' => 'Kegiatan gotong royong membersihkan lingkungan desa.',
                'image_path' => 'gallery/gotong-royong.jpg',
                'album' => 'Kegiatan Warga',
                'status' => 'published',
                'is_featured' => true,
                'tone' => [245, 158, 11],
            ],
            [
                'title' => 'Perayaan HUT RI',
                'description' => 'Kemeriahan perayaan Hari Kemerdekaan di Desa Muneng.',
                'image_path' => 'gallery/hut-ri.jpg',
                'album' => 'Kegiatan Warga',
                'status' => 'published',
                'is_featured' => false,
                'tone' => [220, 38, 38],
            ],
            [
                'title' => 'Masjid Desa Muneng',
                'description' => 'Masjid utama tempat ibadah warga desa.',
                'image_path' => 'gallery/masjid-desa.jpg',
                'album' => 'Suasana Desa',
                'status' => 'published',
                'is_featured' => false,
                'tone' => [13, 148, 136],
            ],
            [
                'title' => 'Posyandu Balita',
                'description' => 'Kegiatan posyandu untuk balita di balai desa.',
                'image_path' => 'gallery/posyandu.jpg',
                'album' => 'Kegiatan Warga',
                'status' => 'published',
                'is_featured' => false,
                'tone' => [59, 130, 246],
            ],
        ];

        foreach ($photos as $photo) {
            $tone = $photo['tone'];
            unset($photo['tone']);

            $this->writePlaceholder($photo['image_path'], $photo['title'], $tone);

            GalleryPhoto::create($photo);
        }
    }

    /**
     * Seeded rows previously pointed at files that never shipped, so /galeri rendered
     * broken thumbnails. Generate a real captioned placeholder instead.
     *
     * @param  array{0:int,1:int,2:int}  $tone
     */
    private function writePlaceholder(string $path, string $caption, array $tone): void
    {
        $disk = Storage::disk('public');

        if ($disk->exists($path)) {
            return;
        }

        if (! function_exists('imagecreatetruecolor')) {
            return;
        }

        $width = 1200;
        $height = 800;
        $image = imagecreatetruecolor($width, $height);

        // Vertical gradient from the tone toward a lighter tint.
        for ($y = 0; $y < $height; $y++) {
            $ratio = $y / $height;
            $color = imagecolorallocate(
                $image,
                (int) ($tone[0] + (255 - $tone[0]) * $ratio * 0.65),
                (int) ($tone[1] + (255 - $tone[1]) * $ratio * 0.65),
                (int) ($tone[2] + (255 - $tone[2]) * $ratio * 0.65),
            );
            imageline($image, 0, $y, $width, $y, $color);
        }

        $white = imagecolorallocate($image, 255, 255, 255);
        $overlay = imagecolorallocatealpha($image, 0, 0, 0, 85);
        imagefilledrectangle($image, 0, $height - 170, $width, $height, $overlay);
        imagestring($image, 5, 40, $height - 120, $this->asciiCaption($caption), $white);
        imagestring($image, 3, 40, $height - 90, 'Desa Muneng - foto contoh', $white);

        ob_start();
        imagejpeg($image, null, 82);
        $binary = (string) ob_get_clean();

        $disk->put($path, $binary);
    }

    /**
     * imagestring() only renders latin-1 bitmap glyphs.
     */
    private function asciiCaption(string $caption): string
    {
        return (string) preg_replace('/[^\x20-\x7E]/', '', $caption);
    }
}
