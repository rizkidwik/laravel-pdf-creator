<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Role;
use App\Models\RoleMenu;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        $dashboard = Menu::create([
            'name' => 'Dashboard',
            'code' => 'dashboard',
            'url' => '/',
            'main_menu' => null,
            'icon' => 'bi bi-grid-fill'
        ]);
        $master = Menu::create([
            'name' => 'Master',
            'code' => 'master',
            'url' => '',
            'main_menu' => null,
            'icon' => 'bi bi-justify-left',
            'menu_hassub' => 1,
        ]);
        $blog = Menu::create([
            'name' => 'Blog',
            'code' => 'blog',
            'url' => 'blog',
            'main_menu' => $master->id,
            'icon' => 'bi bi-home'
        ]);

        $roleSuperadmin = Role::where('role_code', 'superadmin')->first();
        // Create role menu
        RoleMenu::create(
            [
                'role_id' => $roleSuperadmin->id,
                'menu_id' => $dashboard->id
            ]
        );
        RoleMenu::create([
            'role_id' => $roleSuperadmin->id,
            'menu_id' => $master->id
        ]);
        RoleMenu::create(
            [
                'role_id' => $roleSuperadmin->id,
                'menu_id' => $blog->id
            ]
        );
        // $this->call("OthersTableSeeder");
    }
}
