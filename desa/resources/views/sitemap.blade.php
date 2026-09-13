<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>{{ url('/') }}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
    <url><loc>{{ url('/profil-desa') }}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
    <url><loc>{{ url('/acara') }}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
    <url><loc>{{ url('/kenangan') }}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
    <url><loc>{{ url('/destinasi') }}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
    <url><loc>{{ url('/berita') }}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
    <url><loc>{{ url('/umkm') }}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
    <url><loc>{{ url('/galeri') }}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>
    <url><loc>{{ url('/peta') }}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
    <url><loc>{{ url('/kontak') }}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
    @foreach($events as $event)
    <url><loc>{{ url('/acara/' . $event->slug) }}</loc><lastmod>{{ $event->updated_at->toW3cString() }}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
    @endforeach
    @foreach($destinations as $dest)
    <url><loc>{{ url('/destinasi/' . $dest->slug) }}</loc><lastmod>{{ $dest->updated_at->toW3cString() }}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
    @endforeach
    @foreach($announcements as $news)
    <url><loc>{{ url('/berita/' . $news->slug) }}</loc><lastmod>{{ $news->updated_at->toW3cString() }}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
    @endforeach
    @foreach($products as $product)
    <url><loc>{{ url('/umkm/' . $product->slug) }}</loc><lastmod>{{ $product->updated_at->toW3cString() }}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
    @endforeach
    @foreach($memories as $memory)
    <url><loc>{{ url('/kenangan/' . $memory->id) }}</loc><lastmod>{{ $memory->updated_at->toW3cString() }}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
    @endforeach
</urlset>
