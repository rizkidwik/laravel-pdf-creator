<?php

namespace App\Models;

use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    protected $guarded = ['id'];
    protected $fillable = [];


    public function subMenus()
    {
        return $this->hasMany(Menu::class, 'main_menu')->where('active', 1);
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_menus', 'menu_id', 'role_id');
    }

    public function menu_select($role_id)
    {
        return $this->select('menus.*')
            ->selectSub(function ($query) use ($role_id) {
                $query->select('role_menus.id')
                    ->from('role_menus')
                    ->whereColumn('role_menus.menu_id', 'menus.id')
                    ->where('role_menus.deleted_at', null)
                    ->where('role_menus.role_id', $role_id)
                    ->distinct();
            }, 'menu_selected')
            ->from('menus')
            ->get();
    }
}
