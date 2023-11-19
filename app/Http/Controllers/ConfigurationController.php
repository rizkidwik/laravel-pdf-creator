<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use Illuminate\Http\Request;

class ConfigurationController extends Controller
{
    public function index()
    {
        return view('configuration.index');
    }
    public function getConfig()
    {
        $operation = Configuration::get();
        $operation['group'] = Configuration::select('config_group')->distinct()->get();
        // print_r($operation);exit;

        return response()->json($operation);
    }
}
