<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use Yajra\DataTables\DataTables;


class VehicleController extends Controller
{
    public function table(Request $request)
    {
        if ($request->ajax()) {
            $data = Vehicle::select('*')->get();
            return Datatables::of($data)
                ->addIndexColumn()
                ->addColumn('action', function ($row) {
                    // $btn = '<a onclick="onEdit(`' . $row->id . '`)" class="edit-button edit btn btn-primary btn-sm me-2">Edit </a>
                    // <a onclick="onDelete(`' . $row->id . '`)" class="edit-button edit btn btn-danger btn-sm">Delete </a>';
                    $btn = '<a onclick="onPrint(`' . $row->id . '`)" class="edit-button edit btn btn-primary btn-sm me-2">Cetak </a>';
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
        return view('kendaraan.index');
    }
    public function createPdf(Request $request)
    {
        $vehicle = Vehicle::find($request->id);
        $data = [
            'vehicle' => $vehicle
        ];
        
        $pdf = Pdf::loadView('kendaraan.pdf',$data);
        $pdfContent = $pdf->output();

        // Create a Symfony Response and set the PDF content
        $response = new Response($pdfContent);

        // Optionally, set headers for PDF content
        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', 'inline; filename="document.pdf"');

        // Return the Response
        // return $response;
        // return $pdf;
        return $pdf->download('invoice.pdf');
    }
}
