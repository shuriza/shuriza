<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VillageInfo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VillageInfoController extends Controller
{
    public function index(): Response
    {
        $groups = VillageInfo::orderBy('group')->orderBy('order')->get()->groupBy('group');

        return Inertia::render('Admin/VillageInfo/Index', [
            'groups' => $groups,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:village_info,id',
            'items.*.value' => 'nullable|string|max:5000',
        ]);

        foreach ($request->items as $item) {
            VillageInfo::where('id', $item['id'])->update(['value' => $item['value'] ?? '']);
        }

        return back()->with('success', 'Data desa berhasil diperbarui.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:village_info,key',
            'value' => 'nullable|string|max:5000',
            'group' => 'required|string|max:255',
            'label' => 'required|string|max:255',
            'order' => 'nullable|integer',
        ]);

        VillageInfo::create($validated);

        return back()->with('success', 'Data baru berhasil ditambahkan.');
    }

    public function destroy(VillageInfo $villageInfo)
    {
        $villageInfo->delete();
        return back()->with('success', 'Data berhasil dihapus.');
    }
}
