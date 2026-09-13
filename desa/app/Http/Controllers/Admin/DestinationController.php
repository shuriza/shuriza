<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\DestinationImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function index(): Response
    {
        $destinations = Destination::with('images')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Destinations/Index', [
            'destinations' => $destinations,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Destinations/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'required|in:fasilitas,wisata,suasana',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'required|in:draft,published',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $validated['slug'] = $this->uniqueSlug($validated['name']);
        $validated['user_id'] = $request->user()->id;

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('destinations', 'public');
        }

        unset($validated['images']);

        $destination = Destination::create($validated);

        $this->storeGalleryImages($request, $destination);

        return redirect()->route('admin.destinations.index')
            ->with('success', 'Destinasi berhasil dibuat.');
    }

    public function edit(Destination $destination): Response
    {
        $destination->load('images');

        return Inertia::render('Admin/Destinations/Edit', [
            'destination' => $destination,
        ]);
    }

    public function update(Request $request, Destination $destination)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'required|in:fasilitas,wisata,suasana',
            'address' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'required|in:draft,published',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'removed_image_ids' => 'nullable|array',
            'removed_image_ids.*' => 'integer',
        ]);

        $validated['slug'] = $this->uniqueSlug($validated['name'], $destination->id);

        if ($request->hasFile('featured_image')) {
            $this->deleteFile($destination->featured_image);
            $validated['featured_image'] = $request->file('featured_image')->store('destinations', 'public');
        }

        unset($validated['images'], $validated['removed_image_ids']);

        $destination->update($validated);

        if ($removedIds = $request->input('removed_image_ids', [])) {
            $destination->images()->whereIn('id', $removedIds)->get()
                ->each(function (DestinationImage $image): void {
                    $this->deleteFile($image->image_path);
                    $image->delete();
                });
        }

        $this->storeGalleryImages($request, $destination);

        return redirect()->route('admin.destinations.index')
            ->with('success', 'Destinasi berhasil diperbarui.');
    }

    public function destroy(Destination $destination)
    {
        $this->deleteFile($destination->featured_image);

        $destination->images->each(fn (DestinationImage $image) => $this->deleteFile($image->image_path));

        $destination->delete();

        return redirect()->route('admin.destinations.index')
            ->with('success', 'Destinasi berhasil dihapus.');
    }

    /**
     * Persist newly uploaded gallery images after the existing highest order.
     */
    private function storeGalleryImages(Request $request, Destination $destination): void
    {
        if (! $request->hasFile('images')) {
            return;
        }

        $order = (int) $destination->images()->max('order');

        foreach ($request->file('images') as $image) {
            DestinationImage::create([
                'destination_id' => $destination->id,
                'image_path' => $image->store('destinations/gallery', 'public'),
                'order' => ++$order,
            ]);
        }
    }

    private function deleteFile(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Slugs are unique-indexed; suffix collisions so renaming never 500s.
     */
    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $suffix = 1;

        while (Destination::where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = $base.'-'.++$suffix;
        }

        return $slug;
    }
}
