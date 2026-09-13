<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $photos = GalleryPhoto::with('user')->latest()->paginate(20);

        return Inertia::render('Admin/Gallery/Index', [
            'photos' => $photos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'required|image|max:5120',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'album' => 'nullable|string|max:255',
        ]);

        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('gallery', 'public');

            GalleryPhoto::create([
                'title' => $request->title,
                'description' => $request->description,
                'image_path' => $path,
                'album' => $request->album,
                'uploaded_by' => $request->user()->id,
                'status' => 'published',
            ]);
        }

        return back()->with('success', 'Foto berhasil diunggah.');
    }

    public function destroy(GalleryPhoto $galleryPhoto)
    {
        if ($galleryPhoto->image_path && Storage::disk('public')->exists($galleryPhoto->image_path)) {
            Storage::disk('public')->delete($galleryPhoto->image_path);
        }

        $galleryPhoto->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }
}
