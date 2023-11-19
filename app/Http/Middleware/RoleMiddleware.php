<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Http\Request;
use App\Models\Menu;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // $menu = Menu::where('url', $request->path())->first();
        if (Auth::check()) {
            $user = Auth::user();
            // $cekMenu = Menu::with('roles')->where('role_id', auth()->user()->role_id)->get();
            $menus = Menu::with('roles')
                ->whereHas('roles', function ($query) use ($user) {
                    $query->where('role_id', $user->role_id);
                })
                ->get();
            $menuArray = $menus->pluck('url', 'id')->toArray();
            // print_r($menuArray);
            // exit;
            // if ($menu) {
            // $allowedRoles = $cekMenu->pluck('url')->toArray();

            $segments = explode('/', $request->path());
            $firstSegment = $segments[0];
            $menu = Menu::where('url', $firstSegment)->first();
            // print_r($menu->main_menu);
            // exit;
            // print_r($menuArray);
            // print_r(array_key_exists($menu->main_menu, $menuArray));
            // exit;
            // print_r($firstSegment);exit;
            // if ($menu) {
            if ($menu->main_menu != '') {
                if (array_key_exists($menu->main_menu, $menuArray)) {
                    if (in_array($firstSegment, $menuArray)) {
                        return $next($request);
                    }
                }
            } else {
                if (array_key_exists($menu->id, $menuArray)) {
                    if (in_array($firstSegment, $menuArray)) {
                        return $next($request);
                    }
                }
            }
            // }


            // }
        }

        abort(403, 'Unauthorized');
    }
}
