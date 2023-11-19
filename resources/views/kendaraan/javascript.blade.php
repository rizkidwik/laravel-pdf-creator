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
                ajax: "{{ route('kendaraan.table') }}",
                columns: [{
                        data: 'DT_RowIndex',
                        name: 'id',
                        searchable: false,
                        orderable: false,
                    },
                    {
                        data: 'number_plate',
                        name: 'number_plate'
                    },
                    {
                        data: 'body_number',
                        name: 'body_number'
                    },
                    {
                        data: 'owner_name',
                        name: 'owner_name'
                    },
                    {
                        data: 'owner_address',
                        name: 'owner_address'
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


        onPrint = (id) => {
            $("#kendaraan_id").val(id);
            $.ajax({
                url: "{{ route('kendaraan.createPdf') }}",
                data: {
                    id
                },
                xhrFields: {
                    responseType: 'blob'
                },
                success: function(response) {
                    var blob = new Blob([response]);
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = "Surat " +id+ ".pdf";
                    link.click();
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
                data: $('#form-kendaraan').serialize(),
                url: "{{ url('kendaraan') }}",
                type: "POST",
                dataType: 'json',
                success: function(data) {
                    $('#form-kendaraan').trigger("reset");
                    $("#modalKendaraan").modal('hide');
                    $("#kendaraan_id").val('');

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
                        url: "{{ route('kendaraan.destroy') }}",
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
