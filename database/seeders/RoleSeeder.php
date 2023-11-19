<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $roleSuperadmin = Role::create([
            'role_code' => 'superadmin',
            'role_name' => 'Super Admin'
        ]);

        $roleAdmin = Role::create([
            'role_code' => 'admin',
            'role_name' => 'Administrator'
        ]);
        $userSuperadmin = User::factory()->create([
            'name' => ' superadmin user',
            'email' => 'superadmin@mail.com',
            'password' => bcrypt('12345678'),
            'role_id' => $roleSuperadmin->id
        ]);
        $userAdmin = User::factory()->create([
            'name' => ' admin user',
            'email' => 'admin@mail.com',
            'password' => bcrypt('12345678'),
            'role_id' => $roleAdmin->id
        ]);

        

    }
}
