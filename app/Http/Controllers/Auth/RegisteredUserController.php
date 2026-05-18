<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'email'        => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'no_telepon'   => 'nullable|string|max:20',
            'password'     => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'email'        => $request->email,
            'no_telepon'   => $request->no_telepon,
            'password'     => Hash::make($request->password),
            'role'         => 'pengunjung',
        ]);

        event(new Registered($user));

        // Tidak auto-login — arahkan ke halaman login dengan pesan sukses
        return redirect()->route('login')->with(
            'status',
            'Akun berhasil dibuat! Silakan masuk dengan email dan password Anda.'
        );
    }
}
