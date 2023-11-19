@extends('layouts.layout')

@section('title','Blog')

@section('content')
<div class="page-heading">
    <h3>Blog</h3>
</div>
<div class="page-content">
<div class="card">
    <div class="card-header">
        <div class="card-title">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal"
            data-bs-target="#modalBlog">+ Tambah</button>
        </div>
    </div>
    <div class="card-body">
        <div class=" datatable-minimal">
            <table class="table text-nowrap data-table" id="data-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Description</th>
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
@includeIf('blog.form')
@endsection

@include('blog.javascript')
