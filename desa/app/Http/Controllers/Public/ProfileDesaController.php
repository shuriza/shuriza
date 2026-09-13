<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\VillageInfo;
use Inertia\Inertia;
use Inertia\Response;

class ProfileDesaController extends Controller
{
    public function index(): Response
    {
        $profil = VillageInfo::byGroup('profil')->get();
        $demografi = VillageInfo::byGroup('demografi')->get();
        $geografi = VillageInfo::byGroup('geografi')->get();
        $pemerintahan = VillageInfo::byGroup('pemerintahan')->get();
        $sejarah = VillageInfo::getValue('sejarah');
        $deskripsi = VillageInfo::getValue('deskripsi');
        $visi = VillageInfo::getValue('visi');
        $misi = VillageInfo::getValue('misi');
        $latitude = VillageInfo::getValue('latitude');
        $longitude = VillageInfo::getValue('longitude');

        return Inertia::render('Public/ProfilDesa', [
            'profil' => $profil,
            'demografi' => $demografi,
            'geografi' => $geografi,
            'pemerintahan' => $pemerintahan,
            'sejarah' => $sejarah,
            'deskripsi' => $deskripsi,
            'visi' => $visi,
            'misi' => $misi,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);
    }
}
