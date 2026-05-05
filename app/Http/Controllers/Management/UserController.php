<?php

namespace App\Http\Controllers\Management;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'management',
        ]);

        return redirect()->back()->with('success', 'Akun Management berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
        ]);

        $user->username = $request->username;
        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // Jika yang diupdate adalah akun sendiri, perbarui session agar profil langsung sinkron
        if ($id == session('user_id')) {
            session(['username' => $user->username]);
        }

        return redirect()->back()->with('success', 'Akun Management berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent user from deleting their own account
        if ($id == session('user_id')) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }
        
        // Prevent deleting the last management account
        $count = User::whereIn('role', ['management', 'admin'])->count();
        if ($count <= 1) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus akun management terakhir.');
        }

        $user->delete();
        return redirect()->back()->with('success', 'Akun Management berhasil dihapus.');
    }
}
