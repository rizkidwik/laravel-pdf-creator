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
                ajax: "{{ route('role.table') }}",
                columns: [{
                        data: 'DT_RowIndex',
                        name: 'id',
                        searchable: false,
                        orderable: false,
                    },
                    {
                        data: 'role_name',
                        name: 'role_name'
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


        onShowRole = (id) => {
            $("#role_id").val(id);
            $.ajax({
                url: "role-menu/show",
                method: 'POST',
                data: {
                    role_id: id
                },
                success: function(data) {
                    $('#formContent').html('');
                    $.each(data.menu, (i, v) => {
                        var selected = v.menu_selected ? 'checked' : '';
                        if (v.main_menu == null) {
                            var $menu = $(`
                            <div class="form-check form-switch">
                                <label class="form-check-label" for="flexSwitchCheckDefault-${v.id}">${v.name}</label>
                                <input class="form-check-input" type="checkbox" name="menu_id[]" id="flexSwitchCheckDefault-${v.id}" value="${v.id}" ${selected}>
                                </div> 
                                `);
                        } else {
                            var $menu = $(`<div></div>`);
                        }

                        // Cek apakah item memiliki submenu
                        if (v.menu_hassub === 1) {
                            var $submenuContainer = $('<div class="submenu-container"></div>');

                            // Tambahkan submenu ke dalam submenu container
                            $.each(data.menu, (j, subitem) => {
                                if (subitem.main_menu === v.id) {
                                    $
                                    var subSelected = subitem.menu_selected ? 'checked' :
                                        '';
                                    $submenuContainer.append(`
                                            <div class="form-check form-switch">
                                                <label class="form-check-label" for="flexSwitchCheckDefault-${subitem.id}">${subitem.name}</label>
                                                <input class="form-check-input" type="checkbox" name="menu_id[]" id="flexSwitchCheckDefault-${subitem.id}" value="${subitem.id}" ${subSelected}>
                                            </div>
                                    `);
                                }
                            });

                            $menu.append($submenuContainer);
                        }

                        $("#formContent").append($menu);
                    });
                    $("#modalRole").modal('show');
                }
            });
        }

        onSaveRoleMenu = () => {
            HELPER.block();
            $.ajax({
                data: $('#form-role').serialize(),
                url: "{{ route('role.saveRoleMenu') }}",
                type: "POST",
                dataType: 'json',
                success: function(data) {
                    $('#form-role').trigger("reset");
                    $("#modalRole").modal('hide');
                    $("#role_id").val('');

                    table.draw();
                    HELPER.unblock();
                },
                error: function(data) {
                    console.log('Error:', data);
                    Swal.fire({
                        success: false,
                        title: "Error",
                        message: "System error!"
                    });
                }
            });
        };

        onEdit = (id) => {
            $.ajax({
                url: "{{ route('role.showRole') }}",
                method: 'POST',
                data: {
                    role_id: id
                },
                success: function(data) {
                    $("#modelHeadingAdd").html('Ubah Data');
                    $("#role_idAdd").val(data.data.id);
                    $("#role_name").val(data.data.role_name);
                    $("#modalAddRole").modal('show');
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
                data: $('#form-role-add').serialize(),
                url: "{{ route('role.store') }}",
                type: "POST",
                dataType: 'json',
                success: function(data) {
                    $('#form-role-add').trigger("reset");
                    $("#modalAddRole").modal('hide');
                    $("#role_idAdd").val('');

                    table.draw();
                },
                error: function(data) {
                    console.log('Error:', data);
                    Swal.fire({
                        success: false,
                        title: "Error",
                        message: "System error!"
                    });
                }
            });
        };

        onDelete = (id) => {
            HELPER.confirmDelete({
                url: "{{ route('role.destroy') }}",
                data: {
                    id: id
                },
                callback: (response) => {
                    if (response.success) {
                        table.draw();
                    }
                },
            });
        }
    </script>
@endpush
