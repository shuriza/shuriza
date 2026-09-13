<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('user');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filter' => $request->status ?? 'all',
        ]);
    }

    public function approve(Product $product)
    {
        $product->update([
            'status' => 'published',
        ]);

        return back()->with('success', 'Produk berhasil disetujui dan dipublikasikan.');
    }

    public function reject(Product $product)
    {
        $product->update([
            'status' => 'rejected',
        ]);

        return back()->with('success', 'Produk ditolak.');
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return back()->with('success', 'Produk berhasil dihapus.');
    }
}
