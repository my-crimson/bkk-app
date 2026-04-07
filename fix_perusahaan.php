<?php
$replaceMap = [
    'deskripsi' => 'deskripsi_perusahaan',
];

$dir = new RecursiveDirectoryIterator('resources/js/Pages/Perusahaan');
foreach (new RecursiveIteratorIterator($dir) as $file) {
    if ($file->getExtension() === 'jsx') {
        $content = file_get_contents($file->getRealPath());
        $new = str_replace(array_keys($replaceMap), array_values($replaceMap), $content);
        if ($new !== $content) file_put_contents($file->getRealPath(), $new);
    }
}
$dir = new RecursiveDirectoryIterator('resources/js/Pages/Admin/Perusahaan');
foreach (new RecursiveIteratorIterator($dir) as $file) {
    if ($file->getExtension() === 'jsx') {
        $content = file_get_contents($file->getRealPath());
        $new = str_replace(array_keys($replaceMap), array_values($replaceMap), $content);
        if ($new !== $content) file_put_contents($file->getRealPath(), $new);
    }
}

$phpFiles = ['app/Models/Perusahaan.php', 'app/Http/Controllers/PerusahaanController.php'];
foreach ($phpFiles as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $new = str_replace(array_keys($replaceMap), array_values($replaceMap), $content);
        file_put_contents($file, $new);
    }
}
echo "Done replacing perusahaan columns.";
