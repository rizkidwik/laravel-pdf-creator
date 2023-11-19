@extends('layouts.layout')

@section('title','Kendaraan')

@section('content')
<div class="page-heading">
    <h3>Kendaraan</h3>
</div>
<div class="page-content">
    <div class="card">
        <div class="card-header">
            <div class="card-title">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalKendaraan">+ Tambah</button>
            </div>
        </div>
        <div class="card-body">
            <div class=" datatable-minimal">
                <table class="table text-nowrap data-table" id="data-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Plat Nomor</th>
                            <th>Nomor Rangka</th>
                            <th>Pemilik</th>
                            <th>Alamat</th>
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
@includeIf('kendaraan.form')
@endsection

@include('kendaraan.javascript')