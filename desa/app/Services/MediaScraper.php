<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MediaScraper
{
    /**
     * Scrape metadata from a given URL
     * Returns: title, description, thumbnail_url, embed_code, platform, type
     */
    public function scrape(string $url): array
    {
        $platform = $this->detectPlatform($url);

        $metadata = match ($platform) {
            'youtube' => $this->scrapeYoutube($url),
            'tiktok' => $this->scrapeTiktok($url),
            'facebook' => $this->scrapeFacebook($url),
            'instagram' => $this->scrapeInstagram($url),
            default => $this->scrapeGeneric($url),
        };

        $metadata['platform'] = $platform;
        $metadata['source_url'] = $url;

        return $metadata;
    }

    /**
     * Detect platform from URL
     */
    public function detectPlatform(string $url): string
    {
        $url = strtolower($url);

        if (str_contains($url, 'youtube.com') || str_contains($url, 'youtu.be')) {
            return 'youtube';
        }

        if (str_contains($url, 'tiktok.com')) {
            return 'tiktok';
        }

        if (str_contains($url, 'facebook.com') || str_contains($url, 'fb.watch')) {
            return 'facebook';
        }

        if (str_contains($url, 'instagram.com')) {
            return 'instagram';
        }

        return 'unknown';
    }

    /**
     * Detect content type from URL
     */
    public function detectType(string $url, string $platform): string
    {
        // Most social media links are videos
        if (in_array($platform, ['youtube', 'tiktok'])) {
            return 'video';
        }

        if ($platform === 'instagram') {
            // Instagram can be photo or video (reels)
            if (str_contains($url, '/reel/') || str_contains($url, '/reels/')) {
                return 'video';
            }
            return 'photo';
        }

        if ($platform === 'facebook') {
            if (str_contains($url, '/videos/') || str_contains($url, 'watch') || str_contains($url, 'fb.watch')) {
                return 'video';
            }
            if (str_contains($url, '/photos/') || str_contains($url, '/photo/')) {
                return 'photo';
            }
            return 'video';
        }

        return 'video';
    }

    /**
     * Scrape YouTube using oEmbed API
     */
    private function scrapeYoutube(string $url): array
    {
        try {
            $response = Http::timeout(10)->get('https://www.youtube.com/oembed', [
                'url' => $url,
                'format' => 'json',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $videoId = $this->extractYoutubeId($url);

                return [
                    'title' => $data['title'] ?? '',
                    'description' => $data['author_name'] ?? '',
                    'thumbnail_url' => $data['thumbnail_url'] ?? ($videoId ? "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg" : null),
                    'embed_code' => $data['html'] ?? $this->generateYoutubeEmbed($videoId),
                    'type' => 'video',
                    'author' => $data['author_name'] ?? null,
                    'author_url' => $data['author_url'] ?? null,
                    'provider' => 'YouTube',
                ];
            }
        } catch (\Exception $e) {
            Log::warning("YouTube scrape failed for {$url}: " . $e->getMessage());
        }

        // Fallback: try to extract video ID and generate basic metadata
        $videoId = $this->extractYoutubeId($url);
        if ($videoId) {
            return [
                'title' => '',
                'description' => '',
                'thumbnail_url' => "https://img.youtube.com/vi/{$videoId}/maxresdefault.jpg",
                'embed_code' => $this->generateYoutubeEmbed($videoId),
                'type' => 'video',
                'author' => null,
                'author_url' => null,
                'provider' => 'YouTube',
            ];
        }

        return $this->emptyMetadata();
    }

    /**
     * Scrape TikTok using oEmbed API
     */
    private function scrapeTiktok(string $url): array
    {
        try {
            $response = Http::timeout(10)->get('https://www.tiktok.com/oembed', [
                'url' => $url,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'title' => $data['title'] ?? '',
                    'description' => $data['title'] ?? '',
                    'thumbnail_url' => $data['thumbnail_url'] ?? null,
                    'embed_code' => $data['html'] ?? $this->generateTiktokEmbed($url),
                    'type' => 'video',
                    'author' => $data['author_name'] ?? null,
                    'author_url' => $data['author_url'] ?? null,
                    'provider' => 'TikTok',
                ];
            }
        } catch (\Exception $e) {
            Log::warning("TikTok scrape failed for {$url}: " . $e->getMessage());
        }

        return [
            'title' => '',
            'description' => '',
            'thumbnail_url' => null,
            'embed_code' => $this->generateTiktokEmbed($url),
            'type' => 'video',
            'author' => null,
            'author_url' => null,
            'provider' => 'TikTok',
        ];
    }

    /**
     * Scrape Facebook - uses Open Graph tags since oEmbed requires app token
     */
    private function scrapeFacebook(string $url): array
    {
        $metadata = $this->scrapeOpenGraph($url);

        $metadata['embed_code'] = $this->generateFacebookEmbed($url);
        $metadata['type'] = $this->detectType($url, 'facebook');
        $metadata['provider'] = 'Facebook';

        return $metadata;
    }

    /**
     * Scrape Instagram using oEmbed API
     */
    private function scrapeInstagram(string $url): array
    {
        // Instagram oEmbed requires access token now, so we use OG scraping
        $metadata = $this->scrapeOpenGraph($url);

        $metadata['embed_code'] = $this->generateInstagramEmbed($url);
        $metadata['type'] = $this->detectType($url, 'instagram');
        $metadata['provider'] = 'Instagram';

        return $metadata;
    }

    /**
     * Generic scraping using Open Graph meta tags
     */
    private function scrapeGeneric(string $url): array
    {
        return $this->scrapeOpenGraph($url);
    }

    /**
     * Scrape Open Graph meta tags from a URL
     */
    private function scrapeOpenGraph(string $url): array
    {
        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language' => 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                ])
                ->get($url);

            if ($response->successful()) {
                $html = $response->body();
                return $this->parseOpenGraphTags($html);
            }
        } catch (\Exception $e) {
            Log::warning("OG scrape failed for {$url}: " . $e->getMessage());
        }

        return $this->emptyMetadata();
    }

    /**
     * Parse Open Graph meta tags from HTML
     */
    private function parseOpenGraphTags(string $html): array
    {
        $metadata = $this->emptyMetadata();

        // Extract OG tags
        $patterns = [
            'title' => [
                '/<meta\s+property=["\']og:title["\']\s+content=["\']([^"\']*)["\']/',
                '/<meta\s+content=["\']([^"\']*)["\'].*?property=["\']og:title["\']/',
                '/<title>([^<]*)<\/title>/',
            ],
            'description' => [
                '/<meta\s+property=["\']og:description["\']\s+content=["\']([^"\']*)["\']/',
                '/<meta\s+content=["\']([^"\']*)["\'].*?property=["\']og:description["\']/',
                '/<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)["\']/',
            ],
            'thumbnail_url' => [
                '/<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']*)["\']/',
                '/<meta\s+content=["\']([^"\']*)["\'].*?property=["\']og:image["\']/',
            ],
            'type' => [
                '/<meta\s+property=["\']og:type["\']\s+content=["\']([^"\']*)["\']/',
                '/<meta\s+content=["\']([^"\']*)["\'].*?property=["\']og:type["\']/',
            ],
        ];

        foreach ($patterns as $key => $patternList) {
            foreach ($patternList as $pattern) {
                if (preg_match($pattern, $html, $matches)) {
                    $value = html_entity_decode($matches[1], ENT_QUOTES, 'UTF-8');
                    if ($key === 'type') {
                        $metadata['type'] = str_contains($value, 'video') ? 'video' : 'photo';
                    } else {
                        $metadata[$key] = $value;
                    }
                    break;
                }
            }
        }

        // Extract author from meta tags
        $authorPatterns = [
            '/<meta\s+property=["\']og:site_name["\']\s+content=["\']([^"\']*)["\']/',
            '/<meta\s+content=["\']([^"\']*)["\'].*?property=["\']og:site_name["\']/',
        ];

        foreach ($authorPatterns as $pattern) {
            if (preg_match($pattern, $html, $matches)) {
                $metadata['author'] = html_entity_decode($matches[1], ENT_QUOTES, 'UTF-8');
                break;
            }
        }

        return $metadata;
    }

    /**
     * Extract YouTube video ID from URL
     */
    private function extractYoutubeId(string $url): ?string
    {
        $patterns = [
            '/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/',
            '/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    /**
     * Generate YouTube embed HTML
     */
    private function generateYoutubeEmbed(?string $videoId): ?string
    {
        if (!$videoId) return null;

        return '<iframe width="100%" height="315" src="https://www.youtube.com/embed/' . $videoId . '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    }

    /**
     * Generate TikTok embed HTML
     */
    private function generateTiktokEmbed(string $url): string
    {
        $videoId = null;
        if (preg_match('/\/video\/(\d+)/', $url, $matches)) {
            $videoId = $matches[1];
        }

        return '<blockquote class="tiktok-embed" cite="' . htmlspecialchars($url) . '" data-video-id="' . ($videoId ?? '') . '" style="max-width: 605px; min-width: 325px;"><section></section></blockquote><script async src="https://www.tiktok.com/embed.js"></script>';
    }

    /**
     * Generate Facebook embed HTML
     */
    private function generateFacebookEmbed(string $url): string
    {
        $encodedUrl = urlencode($url);
        return '<iframe src="https://www.facebook.com/plugins/video.php?href=' . $encodedUrl . '&show_text=false&width=560" width="100%" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>';
    }

    /**
     * Generate Instagram embed HTML
     */
    private function generateInstagramEmbed(string $url): string
    {
        return '<blockquote class="instagram-media" data-instgrm-permalink="' . htmlspecialchars($url) . '" data-instgrm-version="14" style="max-width:540px; width:100%;"></blockquote><script async src="//www.instagram.com/embed.js"></script>';
    }

    /**
     * Return empty metadata structure
     */
    private function emptyMetadata(): array
    {
        return [
            'title' => '',
            'description' => '',
            'thumbnail_url' => null,
            'embed_code' => null,
            'type' => 'video',
            'author' => null,
            'author_url' => null,
            'provider' => null,
        ];
    }

    /**
     * Batch scrape multiple URLs
     */
    public function batchScrape(array $urls): array
    {
        $results = [];

        foreach ($urls as $url) {
            $results[] = $this->scrape($url);
        }

        return $results;
    }
}
