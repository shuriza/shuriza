<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Destination;
use App\Models\Event;
use App\Models\Memory;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $events = Event::published()->get();
        $destinations = Destination::published()->get();
        $announcements = Announcement::published()->get();
        $products = Product::published()->get();
        $memories = Memory::approved()->get();

        $content = view('sitemap', compact('events', 'destinations', 'announcements', 'products', 'memories'))->render();

        return response($content, 200)->header('Content-Type', 'application/xml');
    }
}
