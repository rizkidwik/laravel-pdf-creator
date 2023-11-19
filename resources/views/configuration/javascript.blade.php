@push('after-script')
    <script type="text/javascript">
        var table = ".data-table";

        $(() => {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            index();
        });

        index = async () => {
            await createTab();
            await HELPER.unblock(500);
        }


        onEdit = (id) => {
            $("#configuration_id").val(id);
            $.ajax({
                url: '{{ url('configuration/show') }}',
                data: {
                    id
                },
                method: 'POST',
                success: function(data) {
                    $("#title").val(data.data.title);
                    $("#description").val(data.data.description);
                    $("#modalConfiguration").modal('show');
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
                data: $('#form-configuration').serialize(),
                url: "{{ url('configuration') }}",
                type: "POST",
                dataType: 'json',
                success: function(data) {
                    $('#form-configuration').trigger("reset");
                    $("#modalConfiguration").modal('hide');
                    $("#configuration_id").val('');

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
                        url: "{{ route('configuration.destroy') }}",
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

        getTtitle = (el) => {
            var title = el.replace(/_/g, ' ');
            return title.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            });
        }

        createTab = () => {
            return new Promise((resolve) => {
                HELPER.block();
                HELPER.ajax({
                    url: "{{ route('configuration.getConfig') }}",
                    type: "GET",
                    success: (response) => {
                        resolve(true)
                        var tabConfig = [];
                        var no = 0;
                        $.each(response.group, (i, v) => {
                            $("#myTabTitle").append(`<li class="nav-item" role="tab">
                                <a class="nav-link ${(no==0) ? 'active' : ''}" id="home-tab" data-bs-toggle="tab" href="#home" role="tab"
                                    aria-controls="home" aria-selected="true">Home</a>
                            </li>`);
                            no++;
                        });
                    },
                    complete: (response) => {
                        HELPER.unblock(500);
                    }
                })
            });
        }

        showTab = (el) => {
            var data = $(el).data();
            $('#titleContent').html(getTtitle(data.group));
            $('.contentConfig').addClass('d-none');
            $(`[data="data-${data.group}"]`).removeClass('d-none')
            $('.tabLink').removeClass('active');
            $(`[data-group="${data.group}"]`).addClass('active');
        }
    </script>
@endpush
