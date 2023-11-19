<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Support\Renderable;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\Blog;
use Yajra\DataTables\Datatables;

class BlogController extends Controller
{
    public function table(Request $request)
    {
        if ($request->ajax()) {
            $data = Blog::select('*');
            return Datatables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    $btn = '<a onclick="onEdit(`' . $row->id . '`)" class="edit-button edit btn btn-primary btn-sm me-2">Edit </a>
                    <a onclick="onDelete(`' . $row->id . '`)" class="edit-button edit btn btn-danger btn-sm">Delete </a>';
                    return $btn;
                })
                ->rawColumns(['action'])
                ->make(true);
        }
    }
    /**
     * Display a listing of the resource.
     * @return Renderable
     */
    public function index()
    {
        return view('blog.index');
    }

    /**
     * Show the form for creating a new resource.
     * @return Renderable
     */
    public function create()
    {
        return view('blog::create');
    }

    /**
     * Store a newly created resource in storage.
     * @param Request $request
     * @return Renderable
     */
    public function store(Request $request)
    {
        // print_r($request->all());exit;
        Blog::updateOrCreate(
            [
                'id' => $request->id
            ],
            $request->all()
        );

        return response()->json(['success' => 'Blog saved successfully.']);
    }

    /**
     * Show the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function show(Request $request)
    {
        try {
            $data = Blog::findOrFail($request->id);
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

    /**
     * Show the form for editing the specified resource.
     * @param int $id
     * @return Renderable
     */
    public function edit($id)
    {
        return view('blog::edit');
    }

    /**
     * Update the specified resource in storage.
     * @param Request $request
     * @param int $id
     * @return Renderable
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @param int $id
     * @return Renderable
     */
    public function destroy(Request $request)
    {
        $data = Blog::findOrFail($request->id);
        $data->delete();
        return response()->json([
            'code' => 200,
            'success' => true,
            'message' => "Deleted data successfully"
        ]);
    }
}
