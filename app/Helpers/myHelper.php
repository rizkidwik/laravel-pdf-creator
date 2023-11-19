<?php

use App\Models\Menu;
use Illuminate\Support\Facades\Auth;

if (!function_exists('getMenus')) {
    function getMenus()
    {
        return Menu::with('subMenus')->where('active', 1)->whereNull('main_menu')->get();
        // $user = Auth::user();
        // print_r

        // $menus = Menu::with('roles')
        //     ->whereHas('roles', function ($query) use ($user) {
        //         $query->where('role_id', $user->role_id);
        //     })
        //     ->get();
        // return $menus;
    }
}
if (!function_exists('isMenuAllowed')) {
    function isMenuAllowed($menu)
    {
        // Ambil peran (role) pengguna saat ini
        $userRole = Auth::user();

        // Cek apakah menu memiliki role yang sesuai dengan role pengguna
        return $menu->roles->contains('id', $userRole->role_id);
    }
}
