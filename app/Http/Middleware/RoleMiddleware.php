<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): mixed
    {
        if (!$request->session()->has('user_id')) {
            // Redirect based on allowed role
            if (in_array('alumni', $roles)) {
                return redirect()->route('login.alumni');
            }
            if (in_array('management', $roles) || in_array('admin', $roles)) {
                return redirect()->route('login.management');
            }
            return redirect()->route('login.management');
        }

        $userRole = $request->session()->get('role');
        // Migrasi role lama: admin disatukan ke management
        if ($userRole === 'admin') {
            $request->session()->put('role', 'management');
            $userRole = 'management';
        }

        if (!in_array($userRole, $roles)) {
            abort(403, 'Akses ditolak. Halaman ini hanya untuk ' . implode(', ', $roles));
        }

        return $next($request);
    }
}
