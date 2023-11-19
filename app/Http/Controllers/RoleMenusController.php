<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Role;
use App\Models\RoleMenu;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;
use Illuminate\Support\Facades\Auth;

class RoleMenusController extends Controller
{
    public function table(Request $request)
    {
        if ($request->ajax()) {
            $data = Role::select('*');
            return Datatables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    $btn = '<a onclick="onShowRole(`' . $row->id . '`)" class="edit-button edit btn btn-primary btn-sm me-2"><i class="fas fa-user-shield"></i> </a>';
                    $btn .= '<a onclick="onEdit(`' . $row->id . '`)" class="edit-button edit btn btn-secondary btn-sm me-2"><i class="fas fa-edit"></i> </a>';
                    $btn .= '<a onclick="onDelete(`' . $row->id . '`)" class="edit-button edit btn btn-danger btn-sm me-2"><i class="fas fa-trash"></i> </a>';
                    return $btn;
                })
                ->rawColumns(['action'])
                ->make(true);
        }
    }
    public function index()
    {
        $menu = Menu::get();

        return view('role-menu.index', compact('menu'));
    }

    public function show(Request $request)
    {
        $role_menu = new Menu();
        $operation['menu'] = $role_menu->menu_select($request->role_id);
        // $data['menu'] = $role_menu->menu_select('01hdqyjma8v2985ez4af4sae7a');

        return response()->json($operation);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['role_code'] = str_replace(' ', '', $request->role_name);
        Role::updateOrCreate(
            [
                'id' => $request->role_id
            ],
            $data
        );

        return response()->json(['success' => 'Role saved successfully.']);
    }

    public function showRole(Request $request){
        try {
            $data = Role::findOrFail($request->role_id);
            return response()->json([
                'code' => 200,
                'success' => true,
                'message' => "Successfully get data!",
                'data' => $data
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 404,
                'success' => false,
                'message' => $th
            ]);
        }
    }

    public function saveRoleMenu(Request $request)
    {
        try {
            $deleteAllRoleMenu = RoleMenu::where('role_id', $request->role_id)->delete();
            foreach ($request->menu_id as $menu_id) {
                RoleMenu::create([
                    'role_id' => $request->role_id,
                    'menu_id' => $menu_id
                ]);
            }
            return response()->json('Successfully');
        } catch (\Throwable $e) {
            return response()->json($e);
        }
    }
    
    public function destroy(Request $request){
        $data = Role::findOrFail($request->id);
        $data->delete();
        return response()->json([
            'code' => 200,
            'success' => true,
            'message' => "Deleted data successfully"
        ]);
    }
    
}
