@push('after-script')
    <script type="text/javascript">
        var table = ".data-table";
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $(function() {
            table = $(table).DataTable({
                processing: true,
                serverSide: true,
                ajax: "{{ route('blog.table') }}",
                columns: [{
                        data: 'DT_RowIndex',
                        name: 'id',
                        searchable: false,
                        orderable: false,
                    },
                    {
                        data: 'title',
                        name: 'title'
                    },
                    {
                        data: 'description',
                        name: 'description'
                    },
                    {
                        data: 'action',
                        name: 'action',
                        orderable: false,
                        searchable: false
                    },
                ]
            });
        });


        onEdit = (id) => {
            $("#blog_id").val(id);
            $.ajax({
                url: '{{ url('blog/show') }}',
                data: {
                    id
                },
                method: 'POST',
                success: function(data) {
                    $("#title").val(data.data.title);
                    $("#description").val(data.data.description);
                    $("#modalBlog").modal('show');
                },
                error: function() {
                    Swal.fire({
                        success: false,
                        title: "Error",
                        message: "System error!"
                    });
                }
            });
        }

        onSave = () => {
            $.ajax({
                data: $('#form-blog').serialize(),
                url: "{{ url('blog') }}",
                type: "POST",
                dataType: 'json',
                success: function(data) {
                    $('#form-blog').trigger("reset");
                    $("#modalBlog").modal('hide');
                    $("#blog_id").val('');

                    table.draw();
                },
                error: function(data) {
                    console.log('Error:', data);
                    Swal.fire({
                        success: false,
                        title: "Error",
                        message: "System error!"
                    });
                    // $('#saveBtn').html('Save Changes');
                }
            });
        };


        onDelete = (id) => {
            Swal.fire({
                icon: 'warning',
                title: 'Do you want to delete this data?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: "{{ route('blog.destroy') }}",
                        data: {
                            id
                        },
                        type: "POST",
                        success: function(data) {
                            Swal.fire('Deleted data successfully');
                            table.draw()
                        }
                    });
                }
            })
        }
    </script>
@endpush
