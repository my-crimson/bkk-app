<?php
$dir = new RecursiveDirectoryIterator('resources/js');
foreach (new RecursiveIteratorIterator($dir) as $file) {
    if ($file->getExtension() === 'jsx') {
        $content = file_get_contents($file->getRealPath());
        $new = str_replace('nama_perusahaan', 'nama', $content);
        if ($new !== $content) file_put_contents($file->getRealPath(), $new);
    }
}
$phpFiles = ['app/Models/Perusahaan.php', 'app/Http/Controllers/PerusahaanController.php', 'app/Http/Controllers/LokerController.php'];
foreach ($phpFiles as $file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        $new = str_replace('nama_perusahaan', 'nama', $content);
        file_put_contents($file, $new);
    }
}
echo "Done replacing nama_perusahaan.";
