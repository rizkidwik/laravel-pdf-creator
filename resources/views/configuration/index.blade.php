@extends('layouts.layout')

@section('title','Configuration')

@section('content')
<div class="page-heading">
    <h3>Configuration</h3>
</div>
<div class="page-content">
<div class="card">
    <div class="card-header">
        {{-- <div class="card-title">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal"
            data-bs-target="#modalConfiguration">+ Tambah</button>
        </div> --}}
    </div>
    <div class="card-body">
        <ul class="nav nav-tabs" id="myTabTitle" role="tablist" >
            
        </ul>
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade " id="home" role="tabpanel" aria-labelledby="home-tab">
                <p class='my-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut nulla
                    neque. Ut hendrerit nulla a euismod pretium.
                    Fusce venenatis sagittis ex efficitur suscipit. In tempor mattis fringilla. Sed id
                    tincidunt orci, et volutpat ligula.
                    Aliquam sollicitudin sagittis ex, a rhoncus nisl feugiat quis. Lorem ipsum dolor sit
                    amet, consectetur adipiscing elit.
                    Nunc ultricies ligula a tempor vulputate. Suspendisse pretium mollis ultrices.</p>
            </div>
            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                Integer interdum diam eleifend metus lacinia, quis gravida eros mollis. Fusce non sapien
                sit amet magna dapibus
                ultrices. Morbi tincidunt magna ex, eget faucibus sapien bibendum non. Duis a mauris ex.
                Ut finibus risus sed massa
                mattis porta. Aliquam sagittis massa et purus efficitur ultricies. Integer pretium dolor
                at sapien laoreet ultricies.
                Fusce congue et lorem id convallis. Nulla volutpat tellus nec molestie finibus. In nec
                odio tincidunt eros finibus
                ullamcorper. Ut sodales, dui nec posuere finibus, nisl sem aliquam metus, eu accumsan
                lacus felis at odio. Sed lacus
                quam, convallis quis condimentum ut, accumsan congue massa. Pellentesque et quam vel
                massa pretium ullamcorper vitae eu
                tortor.
            </div>
            <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                <p class="mt-2">Duis ultrices purus non eros fermentum hendrerit. Aenean ornare interdum
                    viverra. Sed ut odio velit. Aenean eu diam
                    dictum nibh rhoncus mattis quis ac risus. Vivamus eu congue ipsum. Maecenas id
                    sollicitudin ex. Cras in ex vestibulum,
                    posuere orci at, sollicitudin purus. Morbi mollis elementum enim, in cursus sem
                    placerat ut.</p>
            </div>
        </div>
    </div>
</div>
</div>

@endsection

@include('configuration.javascript')
