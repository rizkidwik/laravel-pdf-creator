@extends('layouts.layout')

@section('title', 'Role Menu')

@section('content')
    <div class="page-heading">
        <h3>Role Menu</h3>
    </div>
    <div class="page-content">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAddRole">+
                        Tambah</button>
                </div>
            </div>
            <div class="card-body">
                <div class=" datatable-minimal">
                    <table class="table text-nowrap data-table" id="data-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th width="100px">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    {{-- <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
        <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox
            input</label>
    </div> --}}

    @includeIf('role-menu.form')
@endsection

@include('role-menu.javascript')
