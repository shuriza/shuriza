<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MediaScraper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScraperController extends Controller
{
    public function __construct(
        private MediaScraper $scraper
    ) {}

    /**
     * Preview URL - scrape metadata from a given URL
     * Used by frontend to show live preview when user pastes a link
     */
    public function preview(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url|max:500',
        ]);

        $url = $request->input('url');
        $metadata = $this->scraper->scrape($url);

        return response()->json([
            'success' => true,
            'data' => $metadata,
        ]);
    }

    /**
     * Batch scrape multiple URLs (admin only)
     */
    public function batchScrape(Request $request): JsonResponse
    {
        $request->validate([
            'urls' => 'required|array|max:10',
            'urls.*' => 'required|url|max:500',
        ]);

        $urls = $request->input('urls');
        $results = $this->scraper->batchScrape($urls);

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }
}
