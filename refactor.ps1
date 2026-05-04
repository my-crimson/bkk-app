$ErrorActionPreference = "Stop"
$path = "c:\Users\kurok\bkk-app"

$dirs = @(
    "$path\app",
    "$path\routes",
    "$path\resources\js"
)

foreach ($dir in $dirs) {
    $files = Get-ChildItem -Path $dir -Recurse -Include *.php,*.jsx -File
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        $original = $content
        
        $content = $content.Replace("App\Http\Controllers\Admin", "App\Http\Controllers\Management")
        $content = $content.Replace("Inertia::render('Admin/", "Inertia::render('Management/")
        $content = $content.Replace("prefix('admin')", "prefix('management')")
        $content = $content.Replace("name('admin.", "name('management.")
        $content = $content.Replace("route('admin.", "route('management.")
        $content = $content.Replace("'/admin", "'/management")
        $content = $content.Replace('"/admin', '"/management')
        $content = $content.Replace("`/admin", "`/management")
        $content = $content.Replace("AdminNav", "ManagementNav")
        $content = $content.Replace("AdminPerusahaan", "ManagementPerusahaan")
        $content = $content.Replace("AdminLoker", "ManagementLoker")
        $content = $content.Replace("AdminAlumni", "ManagementAlumni")
        $content = $content.Replace("AdminJurusan", "ManagementJurusan")
        $content = $content.Replace("AdminBerita", "ManagementBerita")
        $content = $content.Replace("AdminInformasi", "ManagementInformasi")
        $content = $content.Replace("Admin Perusahaan", "Management Perusahaan")
        $content = $content.Replace("Admin Loker", "Management Loker")
        $content = $content.Replace("Admin Alumni", "Management Alumni")
        $content = $content.Replace("Admin Jurusan", "Management Jurusan")
        $content = $content.Replace("Admin Berita", "Management Berita")
        $content = $content.Replace("Hubungi Admin", "Hubungi Management")
        $content = $content.Replace("Halo Admin BKK", "Halo Management BKK")
        
        if ($original -ne $content) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "Updated: $($file.Name)"
        }
    }
}
