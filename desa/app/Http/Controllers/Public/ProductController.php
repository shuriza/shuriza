<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::published()->available();

        if ($request->has('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(12);

        return Inertia::render('Public/Products/Index', [
            'products' => $products,
            'filter' => $request->category ?? 'all',
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->published()
            ->available()
            ->firstOrFail();

        $relatedProducts = Product::published()
            ->available()
            ->where('id', '!=', $product->id)
            ->where('category', $product->category)
            ->take(4)
            ->get();

        return Inertia::render('Public/Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Public/Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'nullable|numeric|min:0',
            'price_note' => 'nullable|string|max:100',
            'category' => 'required|in:makanan,minuman,kerajinan,pertanian,jasa,lainnya',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_whatsapp' => 'nullable|string|max:20',
            'image' => 'nullable|image|max:2048',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        Product::create([
            ...$validated,
            'slug' => $slug,
            'image' => $imagePath,
            'status' => 'pending',
            'user_id' => $request->user()?->id,
            'submitted_by_name' => $request->user() ? null : $validated['contact_name'],
        ]);

        return redirect('/umkm')->with('success', 'Terima kasih! Produk Anda akan ditinjau oleh admin sebelum ditampilkan.');
    }
}
