<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showAdminLogin()
    {
        if (session('user_id') && session('role') === 'admin') {
            return redirect()->route('beranda');
        }
        return Inertia::render('Auth/AdminLogin');
    }

    public function showAlumniLogin()
    {
        if (session('user_id') && session('role') === 'alumni') {
            return redirect()->route('beranda');
        }
        return Inertia::render('Auth/AlumniLogin');
    }

    public function showManagementLogin()
    {
        if (session('user_id') && session('role') === 'management') {
            return redirect()->route('beranda');
        }
        return Inertia::render('Auth/ManagementLogin');
    }

    public function loginAdmin(Request $request)
    {
        return $this->processLogin($request, 'admin');
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
            $nama = trim($request->input('nama', ''));
            $password = trim($request->input('password', ''));

            if (empty($nama) || empty($password)) {
                return back()->with('error', 'Username dan password harus diisi');
            }

            $alumni = Alumni::where('nama', $nama)->first();

            if ($alumni && $this->verifyPassword($password, $alumni->password)) {
                session()->regenerate();
                session([
                    'user_id' => $alumni->id,
                    'nama' => $alumni->nama,
                    'role' => 'alumni',
                    'last_login' => time(),
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

            $role = $type === 'management' ? 'management' : 'admin';
            $user = User::where('username', $username)->where('role', $role)->first();

            if ($user && $this->verifyPassword($password, $user->password)) {
                session()->regenerate();
                session([
                    'user_id' => $user->id,
                    'username' => $user->username,
                    'role' => $user->role,
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
        return back()->with('error', 'Username atau password salah');
    }

    private function verifyPassword(string $input, string $stored): bool
    {
        // Support both hashed and plaintext passwords
        if (Hash::check($input, $stored)) {
            return true;
        }
        
        return $input === $stored;
    }

    public function logout()
    {
        session()->flush();
        return redirect()->route('beranda');
    }
}
