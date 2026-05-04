<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{

    public function showAlumniLogin()
    {
        if (session('user_id') && session('role') === 'alumni') {
            return redirect()->route('beranda');
        }
        return Inertia::render('Auth/AlumniLogin');
    }

    public function showManagementLogin()
    {
        if (session('user_id') && in_array(session('role'), ['management', 'admin'], true)) {
            return redirect()->route('beranda');
        }
        return Inertia::render('Auth/ManagementLogin');
    }


    public function loginAlumni(Request $request)
    {
        return $this->processLogin($request, 'alumni');
    }

    public function loginManagement(Request $request)
    {
        return $this->processLogin($request, 'management');
    }

    private function processLogin(Request $request, string $type)
    {
        // Rate limiting
        $attempts = session('login_attempts', 0);
        $lastAttempt = session('last_login_attempt', 0);

        if ($attempts >= 5) {
            $timeSince = time() - $lastAttempt;
            if ($timeSince < 30) {
                return back()->with('error', 'Terlalu banyak percobaan. Silakan tunggu 30 detik.');
            } else {
                session()->forget(['login_attempts', 'last_login_attempt']);
            }
        }

        if ($type === 'alumni') {
            $nisn = trim($request->input('nisn', ''));
            $password = trim($request->input('password', ''));

            if (empty($nisn) || empty($password)) {
                return back()->with('error', 'NISN dan password harus diisi');
            }

            // Cari alumni berdasarkan NISN
            $alumni = Alumni::where('nisn', $nisn)->first();

            if (!$alumni) {
                // Alumni tidak ditemukan
                session([
                    'login_attempts' => $attempts + 1,
                    'last_login_attempt' => time(),
                ]);
                return back()->with('error', 'NISN atau password salah');
            }

            $authenticated = false;

            if ($alumni->password_changed) {
                // Alumni sudah ubah password → hanya bisa login pakai password baru
                $authenticated = $this->verifyPassword($password, $alumni->password);
            } else {
                // Alumni belum ubah password → login pakai NISN sebagai password
                // (password yang dimasukkan harus sama dengan NISN)
                $authenticated = ($password === $alumni->nisn);
            }

            if ($authenticated) {
                session()->regenerate();
                session([
                    'user_id' => $alumni->id,
                    'nama' => $alumni->nama,
                    'role' => 'alumni',
                    'gambar' => $alumni->gambar,
                    'last_login' => time(),
                    'must_change_password' => !$alumni->password_changed,
                ]);
                session()->forget(['login_attempts', 'last_login_attempt']);
                return redirect()->route('beranda');
            }
        } else {
            $username = trim($request->input('username', ''));
            $password = trim($request->input('password', ''));

            if (empty($username) || empty($password)) {
                return back()->with('error', 'Username dan password harus diisi');
            }

            $user = User::where('username', $username)
                ->whereIn('role', ['management', 'admin'])
                ->first();

            if ($user && $this->verifyPassword($password, $user->password)) {
                session()->regenerate();
                session([
                    'user_id' => $user->id,
                    'username' => $user->username,
                    // Canonical role: semua akses admin/management disamakan ke management
                    'role' => 'management',
                    'last_login' => time(),
                ]);
                session()->forget(['login_attempts', 'last_login_attempt']);
                return redirect()->route('beranda');
            }
        }

        // Failed login
        session([
            'login_attempts' => $attempts + 1,
            'last_login_attempt' => time(),
        ]);
        return back()->with('error', 'NISN/Username atau password salah');
    }

    private function verifyPassword(string $input, string $stored): bool
    {
        // Support both hashed (bcrypt) and legacy plaintext passwords.
        // Laravel 12 can throw RuntimeException when non-bcrypt value is checked.
        try {
            if (Hash::check($input, $stored)) {
                return true;
            }
        } catch (\RuntimeException $e) {
            // Ignore and fallback to plaintext check below.
        }

        return $input === $stored;
    }

    public function logout()
    {
        session()->flush();
        return redirect()->route('beranda');
    }
}
