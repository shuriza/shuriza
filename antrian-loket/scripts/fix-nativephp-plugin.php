<?php

declare(strict_types=1);

/**
 * Restore `electron-plugin/dist/server/pdfPageSize.js` for nativephp/desktop 2.3.0.
 *
 * Packagist/GitHub currently ship 2.3.0 as the latest release, and its
 * Electron plugin includes the TypeScript source but not this compiled file.
 * We rebuild the missing package-owned output with the package's own
 * TypeScript compiler, then import the result to verify both syntax and the
 * expected page-size behavior before copying it into place.
 */
$electronDir = __DIR__.'/../vendor/nativephp/desktop/resources/electron';
$distDir = $electronDir.'/electron-plugin/dist/server';
$srcFile = $electronDir.'/electron-plugin/src/server/pdfPageSize.ts';
$outFile = $distDir.'/pdfPageSize.js';
$compiler = $electronDir.'/node_modules/typescript/bin/tsc';

if (is_file($outFile)) {
    exit(0);
}

if (! is_file($srcFile)) {
    fwrite(STDERR, "[antrian] Sumber pdfPageSize.ts tidak ada; perbaikan NativePHP tidak dapat dijalankan.\n");
    exit(1);
}

if (! is_file($compiler)) {
    fwrite(STDERR, "[antrian] Compiler TypeScript bawaan NativePHP tidak ada; perbaikan NativePHP tidak dapat dijalankan.\n");
    exit(1);
}

if (! is_dir($distDir) && ! mkdir($distDir, 0777, true) && ! is_dir($distDir)) {
    fwrite(STDERR, "[antrian] Gagal menyiapkan direktori keluaran NativePHP.\n");
    exit(1);
}

$tempDir = sys_get_temp_dir().DIRECTORY_SEPARATOR.'nativephp-pdf-'.bin2hex(random_bytes(8));
if (! mkdir($tempDir, 0777, true) && ! is_dir($tempDir)) {
    fwrite(STDERR, "[antrian] Gagal membuat direktori kerja sementara.\n");
    exit(1);
}

$tempOutFile = $tempDir.DIRECTORY_SEPARATOR.'pdfPageSize.js';
$compilerCommand = sprintf(
    'node %s --module node16 --moduleResolution node16 --target es2019 --skipLibCheck --types node --typeRoots %s --lib es2019,dom --outDir %s %s',
    escapeshellarg($compiler),
    escapeshellarg($electronDir.'/node_modules/@types'),
    escapeshellarg($tempDir),
    escapeshellarg($srcFile),
);

exec($compilerCommand.' 2>&1', $compilerOutput, $compilerStatus);

if ($compilerStatus !== 0 || ! is_file($tempOutFile)) {
    @unlink($tempOutFile);
    @rmdir($tempDir);

    fwrite(
        STDERR,
        "[antrian] Gagal mengompilasi pdfPageSize.ts dengan TypeScript bawaan:\n".implode("\n", $compilerOutput)."\n"
    );
    exit(1);
}

$verifyCommand = <<<'JS'
const { pathToFileURL } = await import('node:url');
const mod = await import(pathToFileURL(process.argv[1]).href);
if (typeof mod.parsePdfPageSizePoints !== 'function' || typeof mod.buildNativePrintOptions !== 'function') {
    process.exit(1);
}

const sample = Buffer.from('%PDF-1.7\n/MediaBox [0 0 595.2756 841.8898]\n', 'utf8');
const parsed = mod.parsePdfPageSizePoints(sample);
if (! parsed || parsed.widthPt !== 595.2756 || parsed.heightPt !== 841.8898) {
    process.exit(1);
}

const options = mod.buildNativePrintOptions('Printer', parsed);
if (
    options.silent !== true
    || options.deviceName !== 'Printer'
    || options.color !== false
    || options.landscape !== false
    || options.pageSize.width !== 210000
    || options.pageSize.height !== 297000
    || options.margins.marginType !== 'custom'
    || options.margins.top !== 0
    || options.margins.bottom !== 0
    || options.margins.left !== 0
    || options.margins.right !== 0
) {
    process.exit(1);
}
JS;

exec('node --input-type=module --eval '.escapeshellarg($verifyCommand).' '.escapeshellarg($tempOutFile).' 2>&1', $verifyOutput, $verifyStatus);

if ($verifyStatus !== 0) {
    @unlink($tempOutFile);
    @rmdir($tempDir);

    fwrite(
        STDERR,
        "[antrian] Hasil kompilasi pdfPageSize.js gagal verifikasi perilaku:\n".implode("\n", $verifyOutput)."\n"
    );
    exit(1);
}

if (! copy($tempOutFile, $outFile)) {
    @unlink($tempOutFile);
    @rmdir($tempDir);

    fwrite(STDERR, "[antrian] Gagal memulihkan pdfPageSize.js ke direktori NativePHP.\n");
    exit(1);
}

@unlink($tempOutFile);
@rmdir($tempDir);

fwrite(STDOUT, "[antrian] Memulihkan electron-plugin/dist/server/pdfPageSize.js.\n");
