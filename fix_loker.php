<?php
$replaceMap = [
    'deskripsi' => 'deskripsi_lowker',
    'persyaratan' => 'kualifikasi',
];

$dir = new RecursiveDirectoryIterator('resources/js/Pages');
foreach (new RecursiveIteratorIterator($dir) as $file) {
    if ($file->getExtension() === 'jsx') {
        $content = file_get_contents($file->getRealPath());
        $new = str_replace(array_keys($replaceMap), array_values($replaceMap), $content);
        // Be careful not to replace 'deskripsi' in Perusahaan pages if they use 'deskripsi' too
        // Actually Perusahaan has 'deskripsi_perusahaan' !! Let's just do it manually for PHP files
        if ($new !== $content && !str_contains($file->getRealPath(), 'Perusahaan')) {
            file_put_contents($file->getRealPath(), $new);
        }
    }
}

$phpFiles = ['app/Models/Lowker.php', 'app/Http/Controllers/LokerController.php'];
foreach ($phpFiles as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $new = str_replace(array_keys($replaceMap), array_values($replaceMap), $content);
        file_put_contents($file, $new);
    }
}
echo "Done replacing lowker columns.";
