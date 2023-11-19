var HELPER = (function () {
    var menuid = null;
    var role_access = [];
    var CSRF_NAME = "csrf_cookie_name";
    var setVar = [];
    // var blockUI;

    var loadBlock = function (message = "Loading...") {
        $.blockUI({
            message: `<div class="blockui-message" style="z-index: 9999"><span class="spinner-border text-primary"></span> ${message} </div>`,
            css: {
                border: "none",
                backgroundColor: "rgba(47, 53, 59, 0)",
                "z-index": 9999,
            },
        });
    };

    var unblock = function (delay) {
        window.setTimeout(function () {
            $.unblockUI();
        }, delay);
    };

    var html_entity_decode = function (txt) {
        var randomID = Math.floor(Math.random() * 100000 + 1);
        $("body").append('<div id="random' + randomID + '"></div>');
        $("#random" + randomID).html(txt);
        var entity_decoded = $("#random" + randomID).html();
        $("#random" + randomID).remove();
        return entity_decoded;
    };

    return {
        getUriSegment: function (index = "") {
            var url = $(location)
                .attr("href")
                .split("/")
                .splice(0, 5)
                .join("/");
            var segment = url.split("/");
            if (index == "") {
                return segment;
            } else {
                return segment[index];
            }
        },
        displayText: function (data, whiteClass = false) {
            if (whiteClass) {
                $.each(data, function (i, v) {
                    $(`.${i}`)
                        .remove()
                        .queue(function () {
                            $(`.${v}`).removeClass("d-none").dequeue();
                            $(`.${v}`).removeClass(v).dequeue();
                        });
                });
            } else {
                $.each(data, function (i, v) {
                    $(`.${v}`)
                        .remove()
                        .queue(function () {
                            $(`#${v}`).removeClass("d-none").dequeue();
                            $(`.${v}`).removeClass("d-none").dequeue();
                        });
                });
            }
        },
        pushText: function (data) {
            $.each(data, function (i, v) {
                $(`.${i}`)
                    .remove()
                    .queue(function () {
                        $(`#${i}`).html(v).dequeue();
                    });
            });
        },
        getSlug: function () {
            var url = $(location).attr("href");
            url = url.split("/").reverse()[0];
            url = url.split("?")[0];
            return url;
        },
        createSlug: function (str) {
            str = str.toLowerCase();
            str = str.replace(/[^a-z0-9]+/g, "-");
            str = str.replace(/^-+|-+$/g, "");
            return str;
        },
        setStorage: function (key, value = "") {
            localStorage.setItem(key, value);
        },
        getStorage: function (key) {
            localStorage.getItem(key);
        },
        desStorage: function (key) {
            localStorage.removeItem(key);
        },
        getMenuId: function () {
            return menuid;
        },
        block: function (msg) {
            loadBlock(msg);
        },
        unblock: function (delay) {
            unblock(delay);
        },
        toRp: function (angka, num = false) {
            if (angka == "" || angka == "undefined" || angka == null) {
                angka = 0;
            }
            var hasil = 0;
            try {
                hasil = new Intl.NumberFormat("id-ID").format(angka);
            } catch (e) {
                var rev = parseInt(angka, 10)
                    .toString()
                    .split("")
                    .reverse()
                    .join("");
                var rev2 = "";
                var zero = num ? ",00" : "";
                for (var i = 0; i < rev.length; i++) {
                    rev2 += rev[i];
                    if ((i + 1) % 3 === 0 && i !== rev.length - 1) {
                        rev2 += ".";
                    }
                }
                hasil = "" + rev2.split("").reverse().join("") + zero;
            }
            return hasil;
        },
        logout: function () {
            HELPER.confirm({
                title: "Confirm Logout",
                message: "Are your sure you want to Logout?",
                callback: function (result) {
                    if (result) {
                        HELPER.ajax({
                            url: APP_URL + "login/logout",
                            data: {},
                            type: "POST",
                            success: function (response) {
                                if (response.isSaml) {
                                    window.open(BASE_APP + "login/logoutSaml");
                                }
                            },
                            complete: function (response) {
                                window.location.href = response.url;
                            },
                        });
                    }
                },
            });
        },
        logoutAdmin: function () {
            HELPER.confirm({
                title: "Confirm Logout",
                message: "Are your sure you want to Logout?",
                callback: function (result) {
                    if (result) {
                        HELPER.ajax({
                            url: APP_URL + "login/logout",
                            data: {},
                            type: "POST",
                            complete: function (response) {
                                window.location.href = APP_URL;
                            },
                        });
                    }
                },
            });
        },
        setVar: function (key = "", value = "") {
            setVar[key] = value;
        },
        getVar: function (key = "") {
            return setVar[key];
        },
        html_entity_decode: function (txt) {
            html_entity_decode(txt);
        },
        decodeEntity: function (str) {
            return $("<textarea></textarea>").html(str).text();
        },
        nullConverter: function (val, xval) {
            var retval = val;
            if (val === null || val === "" || typeof val == "undefined") {
                retval = typeof xval != "undefined" ? xval : "-";
            }
            return retval;
        },
        loadPage: function (el, isPopState = false) {
            setVar = [];
            HELPER.block();
            $(window).unbind("scroll");
            var page = $(el).data();
            menuid = page.con;

            $($("[data-con]")).removeClass("active");
            $(el).addClass("active");

            return new Promise((resolve, reject) => {
                $.ajax({
                    url: APP_URL + "main/getPage",
                    data: $.extend(page, {
                        //token_csrf: Cookies.get(CSRF_NAME)
                    }),
                    type: "POST",
                    success: function (response) {
                        if (!response.success) {
                            HELPER.showMessage({
                                success: false,
                                title: "Info",
                                message: `${response.message}, please wait a few more moments.`,
                            });
                        }
                    },
                    complete: function (pages) {
                        var responseObject = JSON.parse(pages.responseText);

                        // PUSH STATE
                        if (!isPopState) {
                            var menu = responseObject.menu_code.split(".");
                            var newMenu =
                                typeof menu != "undefined"
                                    ? menu[0].toLowerCase()
                                    : "";
                            window.history.pushState(
                                { menu_id: responseObject.menu_id },
                                responseObject.menu_title,
                                newMenu
                            );
                        }
                        // END PUSH STATE

                        $("#breadcrumb").html(atob(responseObject.breadcrumb));
                        resolve(pages);
                    },
                    error: function (res, status, errorname) {
                        var pages = res.responseJSON;
                        if (
                            (Array.isArray(pages) ||
                                typeof pages === "object") &&
                            pages.success == false &&
                            pages.hasOwnProperty("code")
                        ) {
                            HELPER.showMessage({
                                success: false,
                                message: pages.message,
                                allowOutsideClick: false,
                                callback: function () {
                                    if (pages.code == "401") {
                                        window.location.href = BASE_APP;
                                    }
                                },
                            });
                        }
                        unblock(100);
                        reject();
                    },
                });
            }).then((pages) => {
                try {
                    var responseObject = JSON.parse(pages.responseText);
                } catch (e) {
                    var responseObject = pages;
                }

                return new Promise((chilResolve, chilReject) => {
                    $(".tooltip.show").remove();
                    $("#pagecontainer")
                        .html("")
                        .html(atob(responseObject.view));
                    chilResolve();
                })
                    .then(() => {
                        var container = $("#pagecontainer");
                        $.each(
                            $("[data-roleable=true]", container),
                            function (i, v) {
                                if (
                                    $(v).data("role") != "undefined" &&
                                    $(v).data("role") != ""
                                ) {
                                    var roles = $(v).data("role").split("|");
                                    var checkRole = true;
                                    $.each(roles, function (iR, vR) {
                                        if (HELPER.get_role_access(vR)) {
                                            checkRole = false;
                                        }
                                    });
                                    if (checkRole) {
                                        if (
                                            $(v).data("action") !=
                                                "undefined" &&
                                            $(v).data("action") == "hide"
                                        ) {
                                            $(v).hide();
                                        } else {
                                            $(v).remove();
                                        }
                                    }
                                }
                            }
                        );
                        return;
                    })
                    .then(() => {
                        $('[data-toggleable="tooltip"]').tooltip();
                        $("#pagecontainer").css("visibility", "visible");
                        return;
                    })
                    .then(() => {
                        $("html,body").animate(
                            {
                                scrollTop: 0,
                            },
                            "fast"
                        );
                    });
            });
        },

        get_role_access: function (name = null) {
            if (name) {
                if (role_access) {
                    return role_access.includes(name);
                } else {
                    return false;
                }
            }
            return role_access;
        },

        set_role_access: function (data = "") {
            role_access = JSON.parse(atob(atob(atob(data))));
        },

        initTable: function (config) {
            var isInitComplete = false;
            config.columnDefs.push(
                {
                    defaultContent: "-",
                    targets: "_all",
                },
                {
                    targets: 0,
                    searchable: false,
                    orderable: false,
                }
            );

            config = $.extend(
                true,
                {
                    el: "",
                    multiple: false,
                    sorting: "asc",
                    index: 1,
                    force: false,
                    parentCheck: "checkAll",
                    childCheck: "checkChild",
                    searchAble: true,
                    scrollAble: false,
                    scrollYAble: false,
                    clickAble: true,
                    checkboxAble: false,
                    destroyAble: true,
                    tabDetails: false,
                    showCheckbox: false,
                    responsive: true,
                    pageLength: 10,
                    mouseover: false,
                    stateSave: true,
                    fixedHeader: {
                        header: false,
                        footer: false,
                    },
                    data: {
                        //token_csrf: Cookies.get(CSRF_NAME)
                    },
                    filterColumn: {
                        state: true,
                        exceptionIndex: [],
                    },
                    callbackClick: function () {},
                    rawClick: function () {},
                },
                config
            );

            var xdefault = {
                dom:
                    "<'row'" +
                    "<'col-sm-12 d-flex align-items-center justify-content-end'f>" +
                    ">" +
                    "<'table-responsive'tr>" +
                    "<'row'" +
                    "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'>" +
                    "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'lp>" +
                    ">",
                destroy: config.destroyAble,
                lengthMenu: [5, 10, 25, 50, 100],
                pageLength: config.pageLength,
                searchDelay: 500,
                processing: true,
                serverSide: true,
                //== Order settings
                order: [[config.index, config.sorting]],
                fnDrawCallback: function (oSettings) {
                    if (config.clickAble) {
                        $("#" + config.el + " tbody").off("click");
                        if (config.multiple === false) {
                            $("#" + config.el + " tr").css("cursor", "pointer");
                            $("#" + config.el + " tbody tr").each(function (
                                i,
                                v
                            ) {
                                $(v).on("click", function () {
                                    var payload = oSettings.aoData[i]._aData;
                                    if (oSettings.aoData.length > 0) {
                                        if ($(this).hasClass("selectedRow")) {
                                            $(v).removeClass("selectedRow");
                                            payload["selected"] = false;
                                        } else {
                                            $(".selectedRow").removeClass(
                                                "selectedRow"
                                            );
                                            $(
                                                "#" +
                                                    config.el +
                                                    ".dataTable tbody tr.selectedRow"
                                            ).removeClass("selectedRow");
                                            $(v).addClass("selectedRow");
                                            payload["selected"] = true;
                                        }
                                    }
                                    config.rawClick(payload);
                                });
                            });
                        } else {
                            // progress multiple selected
                        }
                    }
                },
                fnRowCallback: function (row, data, index, rowIndex) {},
                fnInitComplete: function (oSettings, data) {},
                headerCallback: function (thead, data, start, end, display) {
                    if (config.checkboxAble) {
                        thead.getElementsByTagName("th")[0].innerHTML = `
                          <div class="form-check form-check-custom form-check-solid">
                              <input class="form-check-input kt-group-checkable" type="checkbox" value=""/>
                          </div>`;
                    }
                },

                ajax: {
                    url: config.url,
                    type: "POST",
                    data: function (d) {
                        $.extend(
                            d,
                            $.extend(config.data, {
                                //token_csrf: Cookies.get(CSRF_NAME)
                            })
                        );
                    },
                    error: function (error) {
                        var err = error.responseJSON;
                        if (
                            (Array.isArray(err) || typeof err === "object") &&
                            err.success == false &&
                            err.hasOwnProperty("code")
                        ) {
                            HELPER.showMessage({
                                success: false,
                                message: err.message,
                                allowOutsideClick: false,
                                callback: function () {
                                    if (err.code == "401") {
                                        window.location.reload();
                                    }
                                },
                            });
                        } else {
                            HELPER.showMessage();
                        }
                    },
                },
            };

            // if (!config.searchAble) {
            xdefault.dom = `<'row'<'col-sm-12'tr>>
              <'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7 dataTables_pager d-flex justify-content-between'lp>>`;
            // }

            /*add input filter column*/
            /* if (config. filterColumn.state) {
                 $("#" + config.el+ ' tfoot').remove();
                 $("#" + config.el).append('<tfoot>'+$("#" + config.el+' thead').html()+'</tfoot>');                                
             }*/

            var el = $("#" + config.el);
            if (!config.force) {
                var dt = $(el).DataTable($.extend(true, xdefault, config));
            } else {
                var dt = $(el).KTDatatable(config);
            }

            /*if (config.filterColumn.state) {                
                $('#'+config.el+' tfoot th').each( function (i,v) {
                    var title = 'Enter untuk cari';
                    var kelas = (typeof $(v).data('type') == 'undefined') ? '' : $(v).data('type')
                    if (i > 0 && $.inArray(i,config.filterColumn.exceptionIndex) == -1) {
                        $(v).html( '<input type="text" placeholder=": '+title+'" class="form-control search '+kelas+'" />' );
                    } else {
                        $(v).html(' ');                        
                    }
                });
                $('#'+config.el).DataTable().columns().every( function (i,v) {
                    var that = this;
                    $( 'input', this.footer() ).on( 'keyup', function (event) {             
                        if (event.keyCode == 13 || event.which == 13){
                           if ( that.search() !== this.value ) {
                                that
                                    .column(i)
                                    .search( this.value )
                                    .draw();
                            }                   
                        }
                    });
                });
            }*/

            //checkbox checked all
            var dt = $("#" + config.el)
                .DataTable()
                .on("change", ".kt-group-checkable", function () {
                    var set = $(this)
                        .closest("table")
                        .find("td:first-child ." + config.checkChild);
                    var checked = $(this).is(":checked");
                    $(set).each(function () {
                        if (checked) {
                            $(this)
                                .prop("checked", true)
                                .closest("tr")
                                .addClass("active");
                        } else {
                            $(this)
                                .prop("checked", false)
                                .closest("tr")
                                .removeClass("active");
                        }
                    });
                });

            $('.dataTables_filter input[type="search"]').removeClass(
                "form-control-sm"
            );
            $(el)
                .addClass("table-condensed")
                .removeClass("table-striped")
                .addClass("compact nowrap hover dt-head-left");
            return dt;
        },

        getRowData: function (config) {
            var xdata = $.parseJSON(
                atob($($(config.data[0])[2]).data("record"))
            );
            return xdata;
        },

        getRowDataMultiple: function (config) {
            var xdata = $.parseJSON(atob($(config.data[0]).data("record")));
            return xdata;
        },

        getRecord: function (el) {
            return JSON.parse(
                atob(
                    $(
                        $($(el).parents("tr").children("td")[0]).children(
                            "input"
                        )
                    ).data("record")
                )
            );
        },

        getRecordChild: function (el) {
            return JSON.parse(
                atob($($($(el).children("td")[0]).find("input")).data("record"))
            );
        },

        toggleForm: function (config) {
            config = $.extend(
                true,
                {
                    speed: "fast",
                    easing: "swing",
                    callback: function () {},
                    tohide: "table_data",
                    toshow: "form_data",
                    animate: null,
                    scrollTop: true,
                },
                config
            );

            $(".tooltip.show").remove();
            if (config.animate !== null) {
                if (config.animate === "toogle") {
                    if (Array.isArray(config.tohide)) {
                        $.each(config.tohide, function (index, valHide) {
                            $("." + valHide)
                                .addClass("d-none")
                                .fadeToggle(config.speed, function () {
                                    if (Array.isArray(config.toshow)) {
                                        $.each(
                                            config.toshow,
                                            function (index, valShow) {
                                                $("." + valShow)
                                                    .removeClass("d-none")
                                                    .fadeToggle(
                                                        config.speed,
                                                        config.callback
                                                    );
                                            }
                                        );
                                    } else {
                                        $("." + config.toshow)
                                            .removeClass("d-none")
                                            .fadeToggle(
                                                config.speed,
                                                config.callback
                                            );
                                    }
                                });
                        });
                    } else {
                        $("." + config.tohide)
                            .addClass("d-none")
                            .fadeToggle(config.speed, function () {
                                $("." + config.toshow)
                                    .removeClass("d-none")
                                    .fadeToggle(config.speed, config.callback);
                            });
                    }
                } else if (config.animate === "slide") {
                    if (Array.isArray(config.tohide)) {
                        $.each(config.tohide, function (index, valHide) {
                            $("." + valHide)
                                .addClass("d-none")
                                .slideUp(config.speed, function () {
                                    if (Array.isArray(config.toshow)) {
                                        $.each(
                                            config.toshow,
                                            function (index, valShow) {
                                                $("." + valShow)
                                                    .removeClass("d-none")
                                                    .slideDown(
                                                        config.speed,
                                                        config.callback
                                                    );
                                            }
                                        );
                                    } else {
                                        $("." + config.toshow)
                                            .removeClass("d-none")
                                            .slideDown(
                                                config.speed,
                                                config.callback
                                            );
                                    }
                                });
                        });
                    } else {
                        $("." + config.tohide)
                            .addClass("d-none")
                            .slideUp(config.speed, function () {
                                $("." + config.toshow)
                                    .removeClass("d-none")
                                    .slideDown(config.speed, config.callback);
                            });
                    }
                } else {
                    if (Array.isArray(config.tohide)) {
                        $.each(config.tohide, function (index, valHide) {
                            $("." + valHide)
                                .addClass("d-none")
                                .fadeOut(config.speed, function () {
                                    if (Array.isArray(config.toshow)) {
                                        $.each(
                                            config.toshow,
                                            function (index, valShow) {
                                                $("." + valShow)
                                                    .removeClass("d-none")
                                                    .fadeIn(
                                                        config.speed,
                                                        config.callback
                                                    );
                                            }
                                        );
                                    } else {
                                        $("." + config.toshow)
                                            .removeClass("d-none")
                                            .fadeIn(
                                                config.speed,
                                                config.callback
                                            );
                                    }
                                });
                        });
                    } else {
                        $("." + config.tohide)
                            .addClass("d-none")
                            .fadeOut(config.speed, function () {
                                $("." + config.toshow)
                                    .removeClass("d-none")
                                    .fadeIn(config.speed, config.callback);
                            });
                    }
                }
            } else {
                if (Array.isArray(config.tohide)) {
                    $.each(config.tohide, function (index, valHide) {
                        $("." + valHide)
                            .addClass("d-none")
                            .fadeOut(config.speed, function () {
                                if (Array.isArray(config.toshow)) {
                                    $.each(
                                        config.toshow,
                                        function (index, valShow) {
                                            $("." + valShow)
                                                .removeClass("d-none")
                                                .fadeIn(
                                                    config.speed,
                                                    config.callback
                                                );
                                        }
                                    );
                                } else {
                                    $("." + config.toshow)
                                        .removeClass("d-none")
                                        .fadeIn(config.speed, config.callback);
                                }
                            });
                    });
                } else {
                    $("." + config.tohide)
                        .addClass("d-none")
                        .fadeOut(config.speed, function () {
                            $("." + config.toshow)
                                .removeClass("d-none")
                                .fadeIn(config.speed, config.callback);
                        });
                }
            }

            if (config.scrollTop) {
                $("html,body").animate(
                    {
                        scrollTop: 0 /*pos + (offeset ? offeset : 0)*/,
                    },
                    "slow"
                );
            }
        },

        refresh: function (config) {
            config = $.extend(
                true,
                {
                    table: null,
                },
                config
            );

            if (config.table !== null) {
                if (config.table.constructor === Object) {
                    $.each(config.table, function (i, v) {
                        var lastPage = window.localStorage.getItem(
                            "history_dt_page_" + v
                        );
                        $("#" + v)
                            .DataTable()
                            .ajax.reload(null, false);
                    });
                } else if (config.table.constructor === Array) {
                    $.each(config.table, function (i, v) {
                        $("#" + v)
                            .DataTable()
                            .ajax.reload(null, false);
                    });
                } else {
                    $("#" + config.table)
                        .DataTable()
                        .ajax.reload(null, false);
                }
            }
            $(".disable").attr("disabled", true);
        },

        back: function (config) {
            config = $.extend(
                true,
                {
                    speed: "fast",
                    easing: "swing",
                    callback: function () {},
                    tohide: "form_data",
                    toshow: "table_data",
                    animate: null,
                    loadPage: true,
                    table: null,
                    form: null,
                },
                config
            );

            $.when(
                (function () {
                    if (config.table !== null) {
                        if (config.table.constructor === Object) {
                            $.each(config.table, function (i, v) {
                                $("#" + v)
                                    .dataTable()
                                    .fnReloadAjax();
                            });
                        } else if (config.table.constructor === Array) {
                            $.each(config.table, function (i, v) {
                                $("#" + v)
                                    .dataTable()
                                    .fnReloadAjax();
                            });
                        } else {
                            $("#" + config.table)
                                .dataTable()
                                .fnReloadAjax();
                        }
                    }

                    if (config.animate !== null) {
                        if (config.animate === "toogle") {
                            if (Array.isArray(config.tohide)) {
                                $.each(
                                    config.tohide,
                                    function (index, valHide) {
                                        $("." + valHide).fadeToggle(
                                            config.speed,
                                            function () {
                                                if (
                                                    Array.isArray(config.toshow)
                                                ) {
                                                    $.each(
                                                        config.toshow,
                                                        function (
                                                            index,
                                                            valShow
                                                        ) {
                                                            $(
                                                                "." + valShow
                                                            ).fadeToggle(
                                                                config.speed,
                                                                config.callback
                                                            );
                                                        }
                                                    );
                                                } else {
                                                    $(
                                                        "." + config.toshow
                                                    ).fadeToggle(
                                                        config.speed,
                                                        config.callback
                                                    );
                                                }
                                            }
                                        );
                                    }
                                );
                            } else {
                                $("." + config.tohide).fadeToggle(
                                    config.speed,
                                    function () {
                                        $("." + config.toshow).fadeToggle(
                                            config.speed,
                                            config.callback
                                        );
                                    }
                                );
                            }
                        } else if (config.animate === "slide") {
                            if (Array.isArray(config.tohide)) {
                                $.each(
                                    config.tohide,
                                    function (index, valHide) {
                                        $("." + valHide).slideUp(
                                            config.speed,
                                            function () {
                                                if (
                                                    Array.isArray(config.toshow)
                                                ) {
                                                    $.each(
                                                        config.toshow,
                                                        function (
                                                            index,
                                                            valShow
                                                        ) {
                                                            $(
                                                                "." + valShow
                                                            ).slideDown(
                                                                config.speed,
                                                                config.callback
                                                            );
                                                        }
                                                    );
                                                } else {
                                                    $(
                                                        "." + config.toshow
                                                    ).slideDown(
                                                        config.speed,
                                                        config.callback
                                                    );
                                                }
                                            }
                                        );
                                    }
                                );
                            } else {
                                $("." + config.tohide).slideUp(
                                    config.speed,
                                    function () {
                                        $("." + config.toshow).slideDown(
                                            config.speed,
                                            config.callback
                                        );
                                    }
                                );
                            }
                        } else {
                            if (Array.isArray(config.tohide)) {
                                $.each(
                                    config.tohide,
                                    function (index, valHide) {
                                        $("." + valHide).fadeOut(
                                            config.speed,
                                            function () {
                                                if (
                                                    Array.isArray(config.toshow)
                                                ) {
                                                    $.each(
                                                        config.toshow,
                                                        function (
                                                            index,
                                                            valShow
                                                        ) {
                                                            $(
                                                                "." + valShow
                                                            ).fadeIn(
                                                                config.speed,
                                                                config.callback
                                                            );
                                                        }
                                                    );
                                                } else {
                                                    $(
                                                        "." + config.toshow
                                                    ).fadeIn(
                                                        config.speed,
                                                        config.callback
                                                    );
                                                }
                                            }
                                        );
                                    }
                                );
                            } else {
                                $("." + config.tohide).fadeOut(
                                    config.speed,
                                    function () {
                                        $("." + config.toshow).fadeIn(
                                            config.speed,
                                            config.callback
                                        );
                                    }
                                );
                            }
                        }
                    } else {
                        if (Array.isArray(config.tohide)) {
                            $.each(config.tohide, function (index, valHide) {
                                $("." + valHide).fadeOut(
                                    config.speed,
                                    function () {
                                        if (Array.isArray(config.toshow)) {
                                            $.each(
                                                config.toshow,
                                                function (index, valShow) {
                                                    $("." + valShow).fadeIn(
                                                        config.speed,
                                                        config.callback
                                                    );
                                                }
                                            );
                                        } else {
                                            $("." + config.toshow).fadeIn(
                                                config.speed,
                                                config.callback
                                            );
                                        }
                                    }
                                );
                            });
                        } else {
                            $("." + config.tohide).fadeOut(
                                config.speed,
                                function () {
                                    $("." + config.toshow).fadeIn(
                                        config.speed,
                                        config.callback
                                    );
                                }
                            );
                        }
                    }
                })()
            ).done(
                (function () {
                    if (config.loadPage === true) {
                        $("[data-con='" + HELPER.getMenuId() + "']").trigger(
                            "click"
                        );
                    }
                })()
            );
        },

        reloadPage: function () {
            $("[data-con='" + HELPER.getMenuId() + "']").trigger("click");
        },

        getActivePage: function () {
            return menuid;
        },

        save: function (config) {
            var xurl = null;

            if (typeof HELPER.fields != "undefined") {
                if (config.addapi === true) {
                    xurl =
                        $("[name=" + HELPER[config.fields][0] + "]").val() ===
                        ""
                            ? HELPER[config.api].create
                            : HELPER[config.api].update;
                } else {
                    if (typeof HELPER.api != "undefined") {
                        xurl =
                            $("[name=" + HELPER.fields[0] + "]").val() === ""
                                ? HELPER.api.create
                                : HELPER.api.update;
                    }
                }
            }

            config = $.extend(
                true,
                {
                    form: null,
                    confirm: false,
                    confirmMessage: null,
                    data: $.extend(
                        $("[name=" + config.form + "]").serializeObject(),
                        {
                            //token_csrf: Cookies.get(CSRF_NAME)
                        }
                    ),
                    method: "POST",
                    fields: "fields",
                    api: "api",
                    addapi: false,
                    url: xurl,
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        return myXhr;
                    },
                    cache: false,
                    contentType: "application/x-www-form-urlencoded",
                    success: function (response) {
                        if (
                            typeof config.resultMessage == "undefined" ||
                            config.resultMessage
                        ) {
                            HELPER.showMessage({
                                success: response.success,
                                message: response.message,
                                title: response.success ? "Success" : "Failed",
                            });
                        }

                        unblock(100);
                    },
                    error: function (response, status, errorname) {
                        var err = response.responseJSON;
                        if (
                            (Array.isArray(err) || typeof err === "object") &&
                            err.success == false &&
                            err.hasOwnProperty("code")
                        ) {
                            HELPER.showMessage({
                                success: false,
                                message: err.message,
                                allowOutsideClick: false,
                                callback: function () {
                                    if (err.code == "401") {
                                        window.location.reload();
                                    }
                                },
                            });
                        } else {
                            HELPER.showMessage({
                                success: false,
                                title: errorname,
                                message:
                                    "System error, please contact the Administrator",
                            });
                        }
                        unblock(100);
                    },
                    complete: function (response) {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(
                            rsp.success,
                            rsp.id,
                            rsp.record,
                            rsp.message,
                            response
                        );
                    },
                    callback: function (arg) {},
                    oncancel: function (arg) {},
                },
                config
            );

            var do_save = function (_config) {
                loadBlock("Sedang menyimpan data...");
                if (_config.data instanceof FormData) {
                    _config.data.append("token_csrf", Cookies.get(CSRF_NAME));
                    // for (var key of _config.data.keys()) {
                    //     if (_config.data.get(key) instanceof File == false && !HELPER.isNull(_config.data.get(key))) {
                    //         try {
                    //             var san = HtmlSanitizer.SanitizeHtml(_config.data.get(key));
                    //             _config.data.set(key, san);
                    //         } catch (e) {
                    //             console.log(e);
                    //         }
                    //     }
                    // }
                } else {
                    $.extend(_config.data, {
                        //token_csrf: Cookies.get(CSRF_NAME)
                    });
                    for (var key in _config.data) {
                        if (!HELPER.isNull(_config.data.key)) {
                            try {
                                var san = HtmlSanitizer.SanitizeHtml(
                                    _config.data.key
                                );
                                _config.data.key = san;
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
                $.ajax({
                    url: _config.url,
                    data: _config.data,
                    type: _config.method,
                    cache: _config.cache,
                    contentType: _config.contentType,
                    processData: _config.processData,
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        return myXhr;
                    },
                    success: _config.success,
                    error: _config.error,
                    complete: _config.complete,
                });
            };

            if (config.confirm) {
                HELPER.confirm({
                    message:
                        config.confirmMessage != null
                            ? config.confirmMessage
                            : "Are you sure you want to save it?",
                    callback: function (result) {
                        if (result) {
                            do_save(config);
                        } else {
                            config.oncancel(result);
                        }
                    },
                });
            } else {
                do_save(config);
            }
        },

        delete: function (config) {
            config = $.extend(
                true,
                {
                    table: null,
                    confirm: true,
                    method: "POST",
                    api: "api",
                    data: {},
                    multiple: false,
                    fields: "fields",
                    callback: function (arg) {},
                },
                config
            );

            var do_delete = function (_config, id) {
                loadBlock("Sedang menghapus data...");
                var dataSend = {};
                if (_config.data === null) {
                    dataSend["id"] = id;
                } else {
                    dataSend["id"] = id;
                    $.each(_config.data, function (i, v) {
                        dataSend[i] = v;
                    });
                }
                $.ajax({
                    url: HELPER[config.api].delete,
                    data: $.extend(dataSend, {
                        //token_csrf: Cookies.get(CSRF_NAME)
                    }),
                    type: _config.method,
                    success: function (response) {
                        HELPER.showMessage({
                            success: response.success,
                            message: response.message,
                            title: response.success ? "Success" : "Failed",
                        });
                        unblock(100);
                    },
                    error: function (response, status, errorname) {
                        HELPER.showMessage({
                            success: false,
                            title: "Failed to operate",
                            message: errorname,
                        });
                        unblock(100);
                    },
                    complete: function (response) {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(
                            rsp.success,
                            rsp.id,
                            rsp.record,
                            rsp.message
                        );
                    },
                });
            };

            var do_delete_multiple = function (_config, data) {
                var dataSend = {};
                $.each(data, function (i, v) {
                    dataSend[i] = v;
                });
                loadBlock("Sedang menghapus data...");
                $.ajax({
                    url: config.url,
                    data: $.extend(dataSend, {
                        //token_csrf: Cookies.get(CSRF_NAME)
                    }),
                    type: _config.method,
                    success: function (response) {
                        HELPER.showMessage({
                            success: response.success,
                            message: response.message,
                            title: response.success ? "Success" : "Failed",
                        });
                        unblock(100);
                    },
                    error: function (response, status, errorname) {
                        HELPER.showMessage({
                            success: false,
                            title: "Failed to operate",
                            message: errorname,
                        });
                        unblock(100);
                    },
                    complete: function (response) {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(
                            rsp.success,
                            rsp.id,
                            rsp.record,
                            rsp.message
                        );
                    },
                });
            };
            if (config.multiple === false) {
                var data = null;
                $("#" + config.table)
                    .find("input[name=checkbox]")
                    .each(function (key, value) {
                        if ($(value).is(":checked")) {
                            data = $.parseJSON(atob($(value).data("record")));
                        }
                    });
                if (data !== null) {
                    var id = data[HELPER[config.fields][0]];
                    if (config.confirm) {
                        Swal.fire({
                            title: "Informasi",
                            text: "Anda yakin ingin menghapus data?",
                            icon: "warning",
                            confirmButtonText:
                                '<i class="fa fa-check"></i> Yes',
                            confirmButtonClass:
                                "btn btn-focus btn-success m-btn m-btn--pill m-btn--air",

                            showCancelButton: true,
                            cancelButtonText: '<i class="fa fa-times"></i> No',
                            cancelButtonClass:
                                "btn btn-focus btn-danger m-btn m-btn--pill m-btn--air",
                        }).then(function (result) {
                            if (result.value) {
                                do_delete(config, id);
                            }
                        });
                    } else {
                        do_delete(config, id);
                    }
                } else {
                    HELPER.showMessage({
                        title: "Information",
                        message:
                            "You have not selected any data in the table ...!",
                        image: "./assets/img/information.png",
                        time: 2000,
                    });
                }
            } else {
                var data = [];
                $("#" + config.table)
                    .find("input[name=checkbox]")
                    .each(function (key, value) {
                        if ($(value).is(":checked")) {
                            var cek = $.parseJSON(
                                atob($(value).data("record"))
                            );
                            data[key] = cek;
                        }
                    });

                if (data.length > 0) {
                    if (config.confirm) {
                        Swal.fire({
                            title: "Informasi",
                            text: "Anda yakin ingin menghapus data?",
                            icon: "warning",
                            confirmButtonText:
                                '<i class="fa fa-check"></i> Yes',
                            confirmButtonClass:
                                "btn btn-focus btn-success m-btn m-btn--pill m-btn--air",

                            showCancelButton: true,
                            cancelButtonText: '<i class="fa fa-times"></i> No',
                            cancelButtonClass:
                                "btn btn-focus btn-danger m-btn m-btn--pill m-btn--air",
                        }).then(function (result) {
                            if (result.value) {
                                do_delete_multiple(config, data);
                            }
                        });
                    } else {
                        do_delete_multiple(config, data);
                    }
                } else {
                    HELPER.showMessage({
                        title: "Information",
                        message:
                            "You have not selected any data in the table ...!",
                        image: "./assets/img/information.png",
                        time: 2000,
                    });
                }
            }
        },

        getDataFromTable: function (config) {
            config = $.extend(
                true,
                {
                    table: null,
                    multiple: false,
                    callback: function (args) {},
                },
                config
            );
            var data = "";
            var multidata = [];

            $("#" + config.table)
                .find("input[name=checkbox]")
                .each(function (key, value) {
                    if ($(value).is(":checked")) {
                        if (config.multiple) {
                            multidata.push(
                                $.parseJSON(atob($(value).data("record")))
                            );
                        } else {
                            data = $.parseJSON(atob($(value).data("record")));
                        }
                    }
                });
            if (config.multiple) {
                config.callback(multidata);
            } else {
                config.callback(data);
            }
        },

        saveMultiple: function (config) {
            config = $.extend(
                true,
                {
                    url: null,
                    table: null,
                    confirm: true,
                    method: "POST",
                    data: {},
                    message: true,
                    callback: function (arg) {},
                    success: function (arg) {},
                    error: function (arg) {},
                    complete: function (arg) {},
                    cache: false,
                    contentType: false,
                    processData: false,
                    xhr: null,
                },
                config
            );

            var sentData = function (_config, data) {
                var dataSend = {};
                var localdataSend = {};
                var xdataSend = {};

                if (config.data === null) {
                    $.each(data.server, function (i, v) {
                        dataSend[i] = v;
                    });
                    xdataSend = dataSend;
                } else {
                    $.each(data.server, function (i, v) {
                        dataSend[i] = v;
                    });
                    $.each(data.local, function (i, v) {
                        localdataSend[i] = v;
                    });
                    xdataSend["server"] = dataSend;
                    xdataSend["data"] = localdataSend;
                }

                loadBlock("");
                $.ajax({
                    url: config.url,
                    data: $.extend(xdataSend, {
                        //token_csrf: Cookies.get(CSRF_NAME)
                    }),
                    type: _config.method,
                    cache: config.cache,
                    contentType: config.contentTypes,
                    processData: config.processDatas,
                    xhr:
                        config.xhr === null
                            ? function () {
                                  var myXhr = $.ajaxSettings.xhr();
                                  return myXhr;
                              }
                            : config.xhr,
                    success: function (response) {
                        if (config.message == false) {
                            config.success(response);
                        } else {
                            config.success(response);
                            HELPER.showMessage({
                                success: response.success,
                                message: response.message,
                                title: response.success ? "Success" : "Failed",
                            });
                        }
                    },
                    error: function (response, status, errorname) {
                        if (config.message == false) {
                            config.error(response, status, errorname);
                        } else {
                            config.error(response, status, errorname);
                            HELPER.showMessage({
                                success: false,
                                title: "Failed to operate",
                                message: errorname,
                            });
                        }
                    },
                    complete: function (response) {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(
                            rsp.success,
                            rsp.id,
                            rsp.record,
                            rsp.message,
                            rsp
                        );
                        unblock(1000);
                    },
                });
            };

            var data = [];
            var xdata = [];
            $("#" + config.table)
                .find("input[name=checkbox]")
                .each(function (key, value) {
                    if ($(value).is(":checked")) {
                        var cek = null;
                        if ($(value).val().length == 32) {
                            cek = $(value).val();
                        } else {
                            var cek = $.parseJSON(
                                atob($(value).data("record"))
                            );
                        }
                        data[key] = cek;
                    }
                    xdata["server"] = data;
                    xdata["local"] = config.data;
                });
            if (xdata.server.length > 0) {
                if (config.confirm) {
                    Swal.fire({
                        title: "Information",
                        text: "Are you sure you want to save the data?",
                        icon: "info",
                        confirmButtonText: '<i class="fa fa-check"></i> Yes',
                        confirmButtonClass:
                            "btn btn-focus btn-success m-btn m-btn--pill m-btn--air",

                        showCancelButton: true,
                        cancelButtonText: '<i class="fa fa-times"></i> No',
                        cancelButtonClass:
                            "btn btn-focus btn-danger m-btn m-btn--pill m-btn--air",
                    }).then(function (result) {
                        if (result.value) {
                            sentData(config, xdata);
                        }
                    });
                } else {
                    sentData(config, xdata);
                }
            }
        },

        setRowDataTable: function (config) {
            HELPER.saveMultiple(config);
        },

        loadData: function (config) {
            config = $.extend(
                true,
                {
                    debug: false,
                    table: null,
                    type: "POST",
                    url: null,
                    server: false,
                    data: {},
                    fields: "fields",
                    loadToForm: true,
                    multiple: false,
                    before_load: function () {},
                    after_load: function () {},
                    callback: function (arg) {},
                },
                config
            );
            config.before_load();
            loadBlock("Displaying the result ...");
            if (config.server === true) {
                var dataserver = [];
                $("#" + config.table)
                    .find("input[name=checkbox]")
                    .each(function (key, value) {
                        if ($(value).is(":checked")) {
                            dataserver = $.parseJSON(
                                atob($(value).data("record"))
                            );
                            dataserver["id"] = dataserver[HELPER.fields[0]];
                            dataserver["data"] = config.data;
                            $.ajax({
                                url: config.url,
                                data: dataserver,
                                type: config.type,
                                success: function (response) {
                                    var data = "";
                                    if (response.constructor === Object) {
                                        data = response;
                                    } else if (response.constructor === Array) {
                                        data = response[0];
                                    }

                                    if (data !== null && config.loadToForm) {
                                        $.when(
                                            (function () {
                                                $.each(data, function (i, v) {
                                                    if (
                                                        $(
                                                            "[name=" + i + "]"
                                                        ).find(
                                                            "option:selected"
                                                        ).length
                                                    ) {
                                                        $(
                                                            '[name="' + i + '"]'
                                                        ).select2(
                                                            "val",
                                                            data[v]
                                                        );
                                                    } else if (
                                                        $(
                                                            "[name=" + i + "]"
                                                        ).attr("type") ==
                                                        "checkbox"
                                                    ) {
                                                        $(
                                                            '[name="' +
                                                                i +
                                                                '"][value="' +
                                                                v +
                                                                '"]'
                                                        ).prop("checked", true);
                                                    } else if (
                                                        $(
                                                            "[name=" + i + "]"
                                                        ).attr("type") ==
                                                        "radio"
                                                    ) {
                                                        $(
                                                            '[name="' +
                                                                i +
                                                                '"][value="' +
                                                                v +
                                                                '"]'
                                                        ).prop("checked", true);
                                                    } else if (
                                                        $(
                                                            "[name='" + i + "']"
                                                        ).attr("type") == "file"
                                                    ) {
                                                        $(
                                                            "[name=" + i + "]"
                                                        ).val("");
                                                    } else {
                                                        $(
                                                            "[name=" + i + "]"
                                                        ).val(
                                                            html_entity_decode(
                                                                v
                                                            )
                                                        );
                                                    }
                                                });
                                                if (
                                                    dataserver["data"] !== null
                                                ) {
                                                    $.each(
                                                        dataserver["data"],
                                                        function (i, v) {
                                                            if (
                                                                $(
                                                                    "[name=" +
                                                                        i +
                                                                        "]"
                                                                ).attr(
                                                                    "type"
                                                                ) == "checkbox"
                                                            ) {
                                                                $(
                                                                    '[name="' +
                                                                        i +
                                                                        '"][value="' +
                                                                        v +
                                                                        '"]'
                                                                ).prop(
                                                                    "checked",
                                                                    true
                                                                );
                                                            } else if (
                                                                $(
                                                                    "[name=" +
                                                                        i +
                                                                        "]"
                                                                ).attr(
                                                                    "type"
                                                                ) == "radio"
                                                            ) {
                                                                $(
                                                                    '[name="' +
                                                                        i +
                                                                        '"][value="' +
                                                                        v +
                                                                        '"]'
                                                                ).prop(
                                                                    "checked",
                                                                    true
                                                                );
                                                            } else {
                                                                $(
                                                                    "[name=" +
                                                                        i +
                                                                        "]"
                                                                ).val(
                                                                    html_entity_decode(
                                                                        v
                                                                    )
                                                                );
                                                            }
                                                        }
                                                    );
                                                }
                                                config.callback(
                                                    data,
                                                    dataserver
                                                );
                                                return data;
                                            })()
                                        ).done(unblock(100));
                                    } else {
                                        $.when(unblock(100)).then(
                                            (function () {
                                                HELPER.showMessage({
                                                    title: "Information",
                                                    message:
                                                        "No data selected on the table ...!",
                                                    image: "./assets/img/information.png",
                                                    time: 2000,
                                                });
                                            })()
                                        );
                                    }
                                },
                            });
                            if (config.debug) {
                            }
                        }
                    });
            } else {
                var data = config.multiple ? [] : null;
                $("#" + config.table)
                    .find("input[name=checkbox]")
                    .each(function (key, value) {
                        if ($(value).is(":checked")) {
                            if (config.multiple) {
                                data.push(
                                    $.parseJSON(atob($(value).data("record")))
                                );
                            } else {
                                data = $.parseJSON(
                                    atob($(value).data("record"))
                                );
                            }
                            if (config.debug) {
                                console.log(data);
                            }
                        }
                    });
                if (data !== null) {
                    $.when(
                        (function () {
                            if (config.loadToForm) {
                                HELPER[config.fields].forEach(function (
                                    v,
                                    i,
                                    a
                                ) {
                                    if (
                                        $("[name=" + v + "]").find(
                                            "option:selected"
                                        ).length
                                    ) {
                                        if (
                                            $('[name="' + v + '"]').hasClass(
                                                "select2-hidden-accessible"
                                            )
                                        ) {
                                            // $('[name="'+ v +'"]').select2('val',data[v]);
                                            $('[name="' + v + '"]')
                                                .val(data[v])
                                                .trigger("change");
                                        } else {
                                            $('[name="' + v + '"]').val(
                                                data[v]
                                            );
                                        }
                                    } else if (
                                        $("[name=" + v + "]").attr("type") ==
                                        "checkbox"
                                    ) {
                                        $(
                                            '[name="' +
                                                v +
                                                '"][value="' +
                                                data[v] +
                                                '"]'
                                        ).prop("checked", true);
                                    } else if (
                                        $("[name=" + v + "]").attr("type") ==
                                        "radio"
                                    ) {
                                        $(
                                            '[name="' +
                                                v +
                                                '"][value="' +
                                                data[v] +
                                                '"]'
                                        ).prop("checked", true);
                                    } else {
                                        $("[name=" + v + "]").val(
                                            html_entity_decode(data[v])
                                        );
                                    }
                                });
                            }
                            config.callback(data);
                            return data;
                        })()
                    ).done(unblock(500));
                } else {
                    $.when(unblock(500)).then(
                        (function () {
                            HELPER.showMessage({
                                title: "Information",
                                message: "No data selected on the table ...!",
                                image: "./assets/img/information.png",
                                time: 2000,
                            });
                        })()
                    );
                }
            }
        },

        createCombo: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    valueField: null,
                    valueGroup: null,
                    valueAdd: null,
                    selectedField: null,
                    displayField: null,
                    displayField2: null,
                    displayField3: null,
                    url: null,
                    placeholder: "-Choose-",
                    optionCustom: null,
                    grouped: false,
                    withNull: true,
                    data: {},
                    chosen: false,
                    sync: true,
                    disableField: null,
                    dropdownParent: "",
                    elClass: false,
                    allowClear: true,
                    type: "GET",
                    isSelect2: true,
                    callback: function () {},
                },
                config
            );

            if (config.url !== null) {
                if (config.data instanceof FormData) {
                    config.data.append("token_csrf", Cookies.get(CSRF_NAME));
                    for (var key of config.data.keys()) {
                        if (
                            config.data.get(key) instanceof File == false &&
                            !HELPER.isNull(config.data.get(key))
                        ) {
                            try {
                                var san = HtmlSanitizer.SanitizeHtml(
                                    config.data.get(key)
                                );
                                config.data.set(key, san);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                } else {
                    $.extend(config.data, {
                        //token_csrf: Cookies.get(CSRF_NAME)
                    });
                    for (var key in config.data) {
                        if (!HELPER.isNull(config.data.key)) {
                            try {
                                var san = HtmlSanitizer.SanitizeHtml(
                                    config.data.key
                                );
                                config.data.key = san;
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
                $.ajax({
                    url: config.url,
                    data: config.data,
                    type: config.type,
                    async: config.sync,
                    complete: function (response) {
                        var html =
                            config.withNull === true
                                ? "<option value>" +
                                  config.placeholder +
                                  "</option>"
                                : "";
                        html +=
                            config.optionCustom != null
                                ? "<option value='" +
                                  config.optionCustom.id +
                                  "'>" +
                                  config.optionCustom.name +
                                  "</option>"
                                : "";
                        var data = $.parseJSON(response.responseText);
                        if (data.success) {
                            $.each(data.data, function (i, v) {
                                var selectedFix = "";
                                var disable_field = "";
                                if (config.disableField != null) {
                                    if (v[config.disableField]) {
                                        disable_field = "disabled";
                                    }
                                }
                                var sarr = Array.isArray(config.selectedField);
                                if (sarr) {
                                    $.each(
                                        config.selectedField,
                                        function (isf, vsf) {
                                            if (vsf == v[config.valueField]) {
                                                selectedFix = "selected";
                                            }
                                        }
                                    );
                                } else {
                                    if (
                                        Number.isInteger(config.selectedField)
                                    ) {
                                        if (config.selectedField == i) {
                                            selectedFix = "selected";
                                            disable_field = "";
                                        }
                                    } else {
                                        if (
                                            config.selectedField ==
                                            v[config.valueField]
                                        ) {
                                            selectedFix = "selected";
                                            disable_field = "";
                                        }
                                    }
                                }
                                if (config.grouped) {
                                    if (config.displayField3 != null) {
                                        html +=
                                            "<option " +
                                            selectedFix +
                                            " value='" +
                                            v[config.valueField] +
                                            "' data-add='" +
                                            v[config.valueAdd] +
                                            "'  " +
                                            disable_field +
                                            " >" +
                                            v[config.displayField] +
                                            " - " +
                                            v[config.displayField2] +
                                            " ( " +
                                            v[config.displayField3] +
                                            " ) " +
                                            "</option>";
                                    } else {
                                        html +=
                                            "<option " +
                                            selectedFix +
                                            " value='" +
                                            v[config.valueField] +
                                            "' data-add='" +
                                            v[config.valueAdd] +
                                            "'  " +
                                            disable_field +
                                            " >" +
                                            v[config.displayField] +
                                            " - " +
                                            v[config.displayField2] +
                                            "</option>";
                                    }
                                } else {
                                    var disable_field = "";
                                    if (config.disableField != null) {
                                        disable_field = "disabled";
                                    }
                                    html +=
                                        "<option " +
                                        selectedFix +
                                        " value='" +
                                        v[config.valueField] +
                                        "' data-add='" +
                                        v[config.valueAdd] +
                                        "' " +
                                        disable_field +
                                        " >" +
                                        v[config.displayField] +
                                        "</option>";
                                }
                            });
                            if (config.el.constructor === Array) {
                                $.each(config.el, function (i, v) {
                                    config.elClass == true
                                        ? $("." + v).html(html)
                                        : $("#" + v).html(html);
                                });
                            } else {
                                config.elClass == true
                                    ? $("." + config.el).html(html)
                                    : $("#" + config.el).html(html);
                            }
                            if (config.isSelect2) {
                                if (config.chosen) {
                                    if (config.el.constructor === Array) {
                                        $.each(config.el, function (i, v) {
                                            config.elClass == true
                                                ? $("." + v).addClass(v)
                                                : $("#" + v).addClass(v);
                                            $("." + v).select2({
                                                allowClear: config.allowClear,
                                                dropdownAutoWidth: true,
                                                width: "100%",
                                                placeholder: config.placeholder,
                                                dropdownParent:
                                                    config.dropdownParent,
                                            });
                                        });
                                    } else {
                                        config.elClass == true
                                            ? $("." + config.el).addClass(
                                                  config.el
                                              )
                                            : $("#" + config.el).addClass(
                                                  config.el
                                              );
                                        $("." + config.el).select2({
                                            allowClear: config.allowClear,
                                            dropdownAutoWidth: true,
                                            width: "100%",
                                            placeholder: config.placeholder,
                                            dropdownParent:
                                                config.dropdownParent,
                                        });
                                    }
                                } else {
                                    if (config.el.constructor === Array) {
                                        $.each(config.el, function (i, v) {
                                            config.elClass == true
                                                ? $("." + v).addClass(v)
                                                : $("#" + v).addClass(v);
                                            $("." + v).select2({
                                                allowClear: config.allowClear,
                                                dropdownAutoWidth: true,
                                                width: "100%",
                                                dropdownParent:
                                                    config.dropdownParent,
                                            });
                                        });
                                    } else {
                                        config.elClass == true
                                            ? $("." + config.el).addClass(
                                                  config.el
                                              )
                                            : $("#" + config.el).addClass(
                                                  config.el
                                              );
                                        $("." + config.el).select2({
                                            allowClear: config.allowClear,
                                            dropdownAutoWidth: true,
                                            width: "100%",
                                            dropdownParent:
                                                config.dropdownParent,
                                        });
                                    }
                                }
                            }
                        }
                        config.callback(data);
                    },
                    error: function (res, status, errorname) {
                        var pages = res.responseJSON;
                        if (
                            (Array.isArray(pages) ||
                                typeof pages === "object") &&
                            pages.success == false &&
                            pages.hasOwnProperty("code")
                        ) {
                            HELPER.showMessage({
                                success: false,
                                message: pages.message,
                                allowOutsideClick: false,
                                callback: function () {
                                    if (pages.code == "401") {
                                        window.location.reload();
                                    }
                                },
                            });
                        }
                        HELPER.unblock(100);
                    },
                });
            } else {
                var response = {
                    success: false,
                    message: "Url kosong",
                };
                config.callback(response);
            }
        },

        createGroupCombo: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    valueField: null,
                    valueGroup: null,
                    displayField: null,
                    url: null,
                    grouped: false,
                    withNull: true,
                    data: {},
                    chosen: false,
                    callback: function () {},
                },
                config
            );

            if (config.url !== null) {
                $.ajax({
                    url: config.url,
                    data: $.extend(config.data, {
                        //token_csrf: Cookies.get(CSRF_NAME),
                        id: config.valueField,
                        id_group: config.valueGroup,
                    }),
                    type: "POST",
                    complete: function (response) {
                        var data = $.parseJSON(response.responseText);
                        var html =
                            config.withNull === true
                                ? "<option value>-Pilih-</option>"
                                : "";
                        if (data.success) {
                            if (config.grouped) {
                                $.each(data.data, function (i, v) {
                                    html +=
                                        '<optgroup label="' +
                                        i +
                                        '" style="font-wight:bold;">';
                                    $.each(v, function (i2, v2) {
                                        html +=
                                            '<option value="' +
                                            v2[config.valueField] +
                                            '">' +
                                            v2[config.displayField] +
                                            "</option>";
                                    });
                                    html += "</optgroup>";
                                });
                            } else {
                            }

                            if (config.el.constructor === Array) {
                                $.each(config.el, function (i, v) {
                                    $("#" + v).html(html);
                                });
                            } else {
                                $("#" + config.el).html(html);
                            }

                            if (config.chosen) {
                                if (config.el.constructor === Array) {
                                    $.each(config.el, function (i, v) {
                                        $("#" + v).addClass(v);
                                        $("." + v).select2({
                                            allowClear: true,
                                            dropdownAutoWidth: true,
                                            width: "auto",
                                            placeholder: "-Choose-",
                                        });
                                    });
                                } else {
                                    $("#" + config.el).addClass(config.el);
                                    $("." + config.el).select2({
                                        allowClear: true,
                                        dropdownAutoWidth: true,
                                        width: "auto",
                                        placeholder: "-Choose-",
                                    });
                                }
                            }
                        }
                        config.callback(data);
                    },
                });
            } else {
                var response = {
                    success: false,
                    message: "Url kosong",
                };
                config.callback(response);
            }
        },

        setDataMultipleCombo: function (data) {
            $.each(data, function (i, v) {
                HELPER.setChangeCombo(v);
            });
        },

        createChangeCombo: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    data: {},
                    url: null,
                    reset: null,
                    callback: function () {},
                },
                config
            );

            $("#" + config.el).change(function () {
                var id = $(this).val();
                var data = {};
                if (config.reset !== null) {
                    $('[name="' + config.reset + '"]')
                        .val("")
                        .select2("");
                    // $("[name="+config.reset+"]").select2().val("");
                }
                if (config.data === null) {
                    data["id"] = id;
                } else {
                    data = config.data;
                    data["id"] = id;
                }
                $.ajax({
                    url: config.url,
                    data: $.extend(data, {
                        //token_csrf: Cookies.get(CSRF_NAME)
                    }),
                    type: "POST",
                    complete: function (response) {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(
                            rsp.success,
                            id,
                            rsp.data,
                            rsp.total,
                            response
                        );
                    },
                    callback: function (arg) {},
                });
            });
        },

        setChangeCombo: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    data: {},
                    valueField: null,
                    valueAdd: null,
                    displayField: null,
                    displayField2: null,
                    grouped: false,
                    withNull: true,
                    withNullDisabled: true,
                    idMode: false,
                    placeholder: "",
                    select2: false,
                },
                config
            );

            if (config.idMode === true) {
                var html =
                    config.withNull === true
                        ? "<option value='' selected " +
                          (config.withNullDisabled ? "disabled" : "") +
                          ">" +
                          config.placeholder +
                          "</option>"
                        : "";
                $.each(config.data, function (i, v) {
                    var vAdd = "";
                    if (v[config.valueAdd]) {
                        vAdd = " data-add='" + v[config.valueAdd] + "'";
                    }
                    if (config.grouped) {
                        if (config.displayField3 != null) {
                            html +=
                                "<option value='" +
                                v[config.valueField] +
                                "' " +
                                vAdd +
                                ">" +
                                v[config.displayField2] +
                                " - " +
                                v[config.displayField] +
                                " ( " +
                                v[config.displayField3] +
                                " ) " +
                                "</option>";
                        } else {
                            html +=
                                "<option value='" +
                                v[config.valueField] +
                                "' " +
                                vAdd +
                                ">" +
                                v[config.displayField2] +
                                " - " +
                                v[config.displayField] +
                                "</option>";
                        }
                    } else {
                        html +=
                            "<option value='" +
                            v[config.valueField] +
                            "' " +
                            vAdd +
                            ">" +
                            v[config.displayField] +
                            "</option>";
                    }
                });
                $("#" + config.el).html(html);
            } else {
                var html =
                    config.withNull === true
                        ? "<option value='' selected " +
                          (config.withNullDisabled ? "disabled" : "") +
                          ">" +
                          config.placeholder +
                          "</option>"
                        : "";
                $.each(config.data, function (i, v) {
                    var vAdd = "";
                    if (v[config.valueAdd]) {
                        vAdd = " data-add='" + v[config.valueAdd] + "'";
                    }
                    if (config.grouped) {
                        if (config.displayField3 != null) {
                            html +=
                                "<option value='" +
                                v[config.valueField] +
                                "' " +
                                vAdd +
                                ">" +
                                v[config.displayField2] +
                                " - " +
                                v[config.displayField] +
                                " ( " +
                                v[config.displayField3] +
                                " ) " +
                                "</option>";
                        } else {
                            html +=
                                "<option value='" +
                                v[config.valueField] +
                                "' " +
                                vAdd +
                                ">" +
                                v[config.displayField2] +
                                " - " +
                                v[config.displayField] +
                                "</option>";
                        }
                    } else {
                        html +=
                            "<option value='" +
                            v[config.valueField] +
                            "' " +
                            vAdd +
                            ">" +
                            v[config.displayField] +
                            "</option>";
                    }
                });
                $("#" + config.el).html(html);
            }

            if (config.select2) {
                $("#" + config.el).select2({
                    allowClear: true,
                    dropdownAutoWidth: true,
                    placeholder: config.placeholder,
                    width: "100%",
                });
            }
        },

        ajaxCombo: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    limit: 30,
                    url: null,
                    tempData: {},
                    data: {},
                    placeholder: null,
                    displayField: null,
                    displayField2: null,
                    displayField3: null,
                    grouped: false,
                    selected: null,
                    callback: function (res) {},
                },
                config
            );
            var myQ = new Queue();

            myQ.enqueue(function (next) {
                $(config.el).select2({
                    ajax: {
                        url: config.url,
                        dataType: "json",
                        type: "get",
                        data: function (params) {
                            // var search = null;
                            // if (params.term==null && config.sea) {}
                            return {
                                q: params.term, // search term
                                page: params.page,
                                limit: config.limit,
                                fdata: config.data,
                                selectedId:
                                    config.selected != null
                                        ? config.selected.id
                                        : null,
                            };
                        },
                        processResults: function (data, params) {
                            params.page = params.page || 1;
                            return {
                                results: data.items,
                                pagination: {
                                    more:
                                        params.page * config.limit <
                                        data.total_count,
                                },
                            };
                        },
                        cache: true,
                    },
                    placeholder:
                        "Ketik atau Pilih " +
                        (config.placeholder ? config.placeholder : "Data"),
                    minimumInputLength: 0,
                    templateSelection: function (data, container) {
                        $(data.element).attr("data-temp", data.saved);
                        $.each(config.tempData, function (i, v) {
                            $(data.element).attr("data-" + v.key, v.val);
                        });
                        var display = data.text;
                        if (
                            config.displayField != null &&
                            data[config.displayField]
                        ) {
                            if (
                                config.grouped &&
                                config.displayField2 != null
                            ) {
                                if (config.displayField3 != null) {
                                    display =
                                        data[config.displayField] +
                                        " - " +
                                        data[config.displayField2] +
                                        " ( " +
                                        data[config.displayField3] +
                                        " )";
                                } else {
                                    display =
                                        data[config.displayField] +
                                        " - " +
                                        data[config.displayField2];
                                }
                            } else {
                                display = data[config.displayField];
                            }
                        }
                        return display;
                    },
                    templateResult: function (data) {
                        if (data.loading) {
                            return data.text;
                        }

                        var display = data.text;
                        if (config.displayField != null) {
                            if (
                                config.grouped &&
                                config.displayField2 != null
                            ) {
                                if (config.displayField3 != null) {
                                    display =
                                        data[config.displayField] +
                                        " - " +
                                        data[config.displayField2] +
                                        " ( " +
                                        data[config.displayField3] +
                                        " )";
                                } else {
                                    display =
                                        data[config.displayField] +
                                        " - " +
                                        data[config.displayField2];
                                }
                            } else {
                                display = data[config.displayField];
                            }
                        }

                        return display;
                    },
                });
                next();
            }, "pertama")
                .enqueue(function (next) {
                    if (config.selected) {
                        var option = new Option(
                            config.selected.name,
                            config.selected.id,
                            true,
                            true
                        );
                        $(config.el).append(option).trigger("change");
                    }
                    next();
                }, "kedua")
                .dequeueAll();
        },

        ajaxCombox: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    limit: 30,
                    url: null,
                    tempData: null,
                    data: {},
                    placeholder: null,
                    displayField: null,
                    displayField2: null,
                    displayField3: null,
                    grouped: false,
                    selected: null,
                    callback: function (res) {},
                },
                config
            );
            var myQ = new Queue();

            myQ.enqueue(function (next) {
                $(config.el).select2({
                    ajax: {
                        url: config.url,
                        dataType: "json",
                        type: "post",
                        data: function (params) {
                            // var search = null;
                            // if (params.term==null && config.sea) {}

                            return {
                                q: params.term, // search term
                                page: params.page,
                                limit: config.limit,
                                fdata: config.data,
                                selectedId:
                                    config.selected != null
                                        ? config.selected.id
                                        : null,
                                system_csrf_name: Cookies.get(
                                    "system_csrf_cookie_name"
                                ),
                            };
                        },
                        processResults: function (data, params) {
                            params.page = params.page || 1;
                            return {
                                results: data.items,
                                pagination: {
                                    more:
                                        params.page * config.limit <
                                        data.total_count,
                                },
                            };
                        },
                        cache: true,
                    },
                    placeholder: config.placeholder
                        ? config.placeholder
                        : "- Choose -",
                    minimumInputLength: 0,
                    templateSelection: function (data, container) {
                        $(data.element).attr("data-temp", data.saved);
                        $.each(config.tempData, function (i, v) {
                            $(data.element).attr("data-" + v.key, v.val);
                        });
                        var display = data.text;
                        if (
                            config.displayField != null &&
                            data[config.displayField]
                        ) {
                            if (
                                config.grouped &&
                                config.displayField2 != null
                            ) {
                                if (config.displayField3 != null) {
                                    display =
                                        data[config.displayField] +
                                        " - " +
                                        data[config.displayField2] +
                                        " ( " +
                                        data[config.displayField3] +
                                        " )";
                                } else {
                                    display =
                                        data[config.displayField] +
                                        " - " +
                                        data[config.displayField2];
                                }
                            } else {
                                display = data[config.displayField];
                            }
                        }
                        return display;
                    },
                    templateResult: function (data) {
                        if (data.loading) {
                            return data.text;
                        }

                        var display = data.text;
                        if (config.displayField != null) {
                            if (
                                config.grouped &&
                                config.displayField2 != null
                            ) {
                                if (config.displayField3 != null) {
                                    display =
                                        data[config.displayField] +
                                        " - " +
                                        data[config.displayField2] +
                                        " ( " +
                                        data[config.displayField3] +
                                        " )";
                                } else {
                                    display =
                                        data[config.displayField] +
                                        " - " +
                                        data[config.displayField2];
                                }
                            } else {
                                display = data[config.displayField];
                            }
                        }

                        return display;
                    },
                });
                next();
            }, "pertama")
                .enqueue(function (next) {
                    if (config.selected) {
                        var option = new Option(
                            config.selected.name,
                            config.selected.id,
                            true,
                            true
                        );
                        $(config.el).append(option).trigger("change");
                    }
                    next();
                }, "kedua")
                .dequeueAll();
        },

        ajax: function (config) {
            config = $.extend(
                true,
                {
                    data: {},
                    url: null,
                    type: "POST",
                    dataType: null,
                    success: function () {},
                    complete: function () {},
                    error: function () {},
                },
                config
            );
            if (config.data instanceof FormData) {
                config.data.append("token_csrf", Cookies.get(CSRF_NAME));
                for (var key of config.data.keys()) {
                    if (
                        config.data.get(key) instanceof File == false &&
                        !HELPER.isNull(config.data.get(key))
                    ) {
                        try {
                            var san = HtmlSanitizer.SanitizeHtml(
                                config.data.get(key)
                            );
                            config.data.set(key, san);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            } else {
                // $.extend(config.data, {
                //     //token_csrf: Cookies.get(CSRF_NAME)
                // })
                for (var key in config.data) {
                    if (!HELPER.isNull(config.data.key)) {
                        try {
                            var san = HtmlSanitizer.SanitizeHtml(
                                config.data.key
                            );
                            config.data.key = san;
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
            var xdefault = {
                url: config.url,
                data: config.data,
                type: config.type,
                dataType: config.dataType,
                success: function (data) {
                    config.success(data);
                },
                complete: function (response) {
                    var rsp = $.parseJSON(response.responseText);
                    config.complete(rsp, response);
                },
                error: function (error) {
                    var err = error.responseJSON;
                    if (
                        (Array.isArray(err) || typeof err === "object") &&
                        err.success == false &&
                        err.hasOwnProperty("code")
                    ) {
                        HELPER.showMessage({
                            success: false,
                            message: err.message,
                            allowOutsideClick: false,
                            callback: function () {
                                if (err.code == "401") {
                                    window.location.reload();
                                }
                            },
                        });
                    }
                    config.error(error);
                },
            };
            if (config.hasOwnProperty("contentType")) {
                xdefault["contentType"] = config.contentType;
            }
            if (config.hasOwnProperty("processData")) {
                xdefault["processData"] = config.processData;
            }
            $.ajax(xdefault);
        },

        showMessage: function (config) {
            config = $.extend(
                true,
                {
                    success: false,
                    message: "System error, please contact the Administrator",
                    title: "Failed",
                    time: 5000,
                    sticky: false,
                    allowOutsideClick: true,
                    toast: false,
                    type: "blue",
                    btnClass: "btn-primary",
                    callback: function () {},
                },
                config
            );
            if (config.toast === false) {
                if (config.success == true) {
                    $.confirm({
                        title:
                            config.title == "Failed" ? "Success" : config.title,
                        content: config.message,
                        theme: "material",
                        type: config.type,
                        buttons: {
                            ok: {
                                text: "ok!",
                                btnClass: config.btnClass,
                                keys: ["enter"],
                                action: function () {
                                    config.callback(true);
                                },
                            },
                        },
                    });
                } else {
                    $.confirm({
                        title: config.title,
                        content: config.message,
                        theme: "material",
                        type: "red",
                        buttons: {
                            ok: {
                                text: "ok!",
                                btnClass: config.btnClass,
                                keys: ["enter"],
                                action: function () {
                                    config.callback(true);
                                },
                            },
                        },
                    });
                }
            } else {
                `toastr`.options = {
                    closeButton: true,
                    debug: false,
                    newestOnTop: false,
                    progressBar: true,
                    positionClass: "toast-bottom-right",
                    preventDuplicates: false,
                    onclick: null,
                    showDuration: "300",
                    hideDuration: "1000",
                    timeOut: "5000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut",
                };
                if (config.success == true) {
                    toastr.success(
                        config.message,
                        config.title == "Failed" ? "Success" : config.title
                    );
                } else if (config.success == false) {
                    toastr.error(config.message, config.title);
                } else if (config.success == "warning") {
                    toastr.warning(
                        config.message,
                        config.title == "Failed" ? "Warning" : config.title
                    );
                } else {
                    toastr.info(config.message, config.title);
                }
            }
        },

        handleValidation: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    setting: null,
                    declarative: false,
                    customPlugin: null,
                    submit: true,
                    useRegex: true,
                },
                config
            );

            if (
                config.el != null &&
                (config.setting != null || config.declarative == true)
            ) {
                var fields = [];

                $.each(config.setting, function (i, v) {
                    var temp_validators = [];
                    $.each(v.rule, function (ii, vv) {
                        var temp_val = {};

                        if (
                            v.hasOwnProperty("maxlength") &&
                            v.hasOwnProperty("minlength")
                        ) {
                            temp_validators["stringLength"] = {
                                max: v.maxlength,
                                min: v.minlength,
                            };
                        } else {
                            if (ii == "maxlength") {
                                temp_validators["stringLength"] = {
                                    max: vv,
                                };
                            }
                            if (ii == "minlength") {
                                temp_validators["stringLength"] = {
                                    min: vv,
                                };
                            }
                        }
                        if (ii == "required" && vv == true) {
                            temp_validators["notEmpty"] = {};
                            $(v.selector).attr("required", true);
                            if (
                                $(v.selector)
                                    .parents(".form-group")
                                    .children("label")
                                    .children("span.required").length <= 0
                            ) {
                                $(v.selector)
                                    .parents(".form-group")
                                    .children("label")
                                    .append(
                                        '<span class="required" aria-required="true"> *</span>'
                                    );
                            }
                        } else if (ii == "readonly" && vv == true) {
                            temp_validators["notEmpty"] = {};
                            $(v.selector).attr("readonly", true);
                        } else if (ii == "email" && vv == true) {
                            temp_validators["emailAddress"] = {};
                        } else if (ii == "disabled" && vv == true) {
                            temp_validators["notEmpty"] = {};
                            $(v.selector).attr("disabled", true);
                        } else if (ii == "max") {
                            temp_validators["lessThan"] = {
                                max: vv,
                            };
                        } else if (ii == "min") {
                            temp_validators["greaterThan"] = {
                                min: vv,
                            };
                        } else if (ii == "callback") {
                            temp_validators["callback"] = vv;
                        } else if (ii == "promise") {
                            temp_validators["promise"] = vv;
                        } else if (ii == "useRegex" && vv == true) {
                            temp_validators["regexp"] = {
                                regexp: /^[^*\|\"<>[\]{}`\\';&$]+$/,
                                message:
                                    "Hanya diperbolehkan huruf, angka dan beberapa karakter.",
                            };
                        } else {
                            temp_validators[ii] = vv;
                        }
                    });

                    fields[v.name] = {
                        selector: v.selector,
                        validators: temp_validators,
                    };
                });

                var pluginValidation = {
                    //Learn more: https://formvalidation.io/guide/plugins
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    // bootstrap: new FormValidation.plugins.Bootstrap(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row",
                    }),
                };
                /*plugins: {
                    trigger: new FormValidation.plugins.Trigger,
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row"
                    })
                }*/

                if (config.submit) {
                    // Validate fields when clicking the Submit button
                    pluginValidation["submitButton"] =
                        new FormValidation.plugins.SubmitButton();
                    // Submit the form when all fields are valid
                    pluginValidation["defaultSubmit"] =
                        new FormValidation.plugins.DefaultSubmit();
                }

                if (config.declarative) {
                    pluginValidation["declarative"] =
                        new FormValidation.plugins.Declarative({
                            html5Input: true,
                        });
                }
                if (config.customPlugin) {
                    if (Array.isArray(config.customPlugin)) {
                        $.each(config.customPlugin, function (i, v) {
                            if (
                                v.hasOwnProperty("pluginName") &&
                                v.hasOwnProperty("pluginConfig")
                            ) {
                                pluginValidation[v.pluginName] = v.pluginConfig;
                            }
                        });
                    } else {
                        if (
                            config.customPlugin.hasOwnProperty("pluginName") &&
                            config.customPlugin.hasOwnProperty("pluginConfig")
                        ) {
                            pluginValidation[config.customPlugin.pluginName] =
                                config.customPlugin.pluginConfig;
                        }
                    }
                }

                const fv = FormValidation.formValidation(
                    document.getElementById(config.el),
                    {
                        locale: "id_ID",
                        localization: FormValidation.locales.id_ID,
                        fields: fields,
                        plugins: pluginValidation,
                    }
                );

                var fvFields = fv.getFields();
                for (var index in fvFields) {
                    if (typeof index !== "undefined") {
                        var v = fvFields[index];
                        if (v.hasOwnProperty("validators")) {
                            if (v.validators.hasOwnProperty("notEmpty")) {
                                var selectorField = null;
                                if (
                                    v.hasOwnProperty("selector") &&
                                    v.selector != ""
                                ) {
                                    selectorField = v.selector;
                                } else {
                                    selectorField = "[name=" + index + "]";
                                }
                                if (
                                    $("#" + config.el)
                                        .find(selectorField)
                                        .parents(".form-group")
                                        .children("label")
                                        .children("span.required").length <= 0
                                ) {
                                    $("#" + config.el)
                                        .find(selectorField)
                                        .parents(".form-group")
                                        .children("label")
                                        .append(
                                            '<span class="required" aria-required="true"> *</span>'
                                        );
                                }
                            }
                        }
                        if (
                            config.useRegex &&
                            v.validators.hasOwnProperty("regexp") == false
                        ) {
                            var selectorField = null;
                            if (
                                v.hasOwnProperty("selector") &&
                                v.selector != ""
                            ) {
                                selectorField = v.selector;
                            } else {
                                selectorField = "[name=" + index + "]";
                            }
                            var regexpchar = /^[^*\|\"<>[\]{}`\\';&$]+$/;
                            var optionsNewField = {
                                validators: {
                                    regexp: {
                                        regexp: regexpchar,
                                        message:
                                            "Hanya diperbolehkan huruf, angka dan beberapa karakter.",
                                    },
                                },
                            };
                            fv.addField(index, optionsNewField);
                        }
                    }
                }

                return fv;
            } else {
                return false;
            }
        },

        setRequired: function (el) {
            $(el).each(function (i, v) {
                $("[name=" + v + "]")
                    .attr("required", true)
                    .parents(".form-group")
                    .children("label")
                    .append(
                        '<span class="required" aria-required="true"> *</span>'
                    );
            });
        },

        print: function (config) {
            config = $.extend(
                true,
                {
                    el: "bodylaporan",
                    page: null,
                    csslink: null,
                    historyprint: null,
                    callback: function () {},
                },
                config
            );

            var contents =
                config.el.length > 32 ? config.el : $("#" + config.el).html();
            var frame1 = $("<iframe />");
            frame1[0].name = "frame1";
            frame1.css({
                position: "absolute",
                top: "-1000000px",
            });
            $("body").append(frame1);
            var frameDoc = frame1[0].contentWindow
                ? frame1[0].contentWindow
                : frame1[0].contentDocument.document
                ? frame1[0].contentDocument.document
                : frame1[0].contentDocument;
            frameDoc.document.open();
            frameDoc.document.write(
                '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
            );
            frameDoc.document.write("<html>");
            frameDoc.document.write("</head>");
            frameDoc.document.write("</body>");
            if (config.csslink != null) {
                if (config.csslink.constructor === Array) {
                    $.each(config.csslink, function (i, v) {
                        frameDoc.document.write(
                            '<link href="' +
                                v +
                                '" rel="stylesheet" type="text/css" />'
                        );
                    });
                } else {
                    frameDoc.document.write(
                        '<link href="' +
                            config.csslink +
                            '" rel="stylesheet" type="text/css" />'
                    );
                }
            }
            frameDoc.document.write(contents);
            frameDoc.document.write("</body></html>");
            frameDoc.document.close();
            if (config.historyprint != null) {
                $.ajax({
                    url: config.historyprint,
                    success: function (response) {},
                    complete: function (response) {
                        var rsp = $.parseJSON(response.responseText);
                        config.callback(rsp.success, id, rsp.data, rsp.total);
                    },
                    callback: function (arg) {},
                });
            }
            setTimeout(function () {
                window.frames["frame1"].focus();
                window.frames["frame1"].print();
                frame1.remove();
            }, 300);
        },

        confirm: function (config) {
            config = $.extend(
                true,
                {
                    title: "Information",
                    message: null,
                    size: "small",
                    type: "blue",
                    confirmLabel: '<i class="fa fa-check"></i> Yes',
                    confirmClassName:
                        "btn btn-focus btn-success m-btn m-btn--pill m-btn--air",
                    cancelLabel: '<i class="fa fa-times"></i> No',
                    cancelClassName:
                        "btn btn-focus btn-danger m-btn m-btn--pill m-btn--air",
                    showLoaderOnConfirm: false,
                    allowOutsideClick: true,
                    callback: function () {},
                },
                config
            );

            $.confirm({
                title: config.title,
                content: config.message,
                theme: "material",
                type: config.type,
                buttons: {
                    ok: {
                        text: "ok!",
                        btnClass: "btn-primary",
                        keys: ["enter"],
                        action: function () {
                            config.callback(true);
                        },
                    },
                    cancel: function () {
                        config.callback(false);
                    },
                },
            });
        },

        confirmDelete: function (config) {
            config = $.extend(
                true,
                {
                    url: null,
                    data: null,
                    type: null,
                    withAjax: true,
                    resultMessage: true,
                    callback: function () {},
                },
                config
            );
            HELPER.confirm({
                message: 'Are you sure you want to delete the data?',
                callback: function (result) {
                    if (result && config.withAjax) {
                        HELPER.block();
                        HELPER.ajax({
                            url: (config.url == null) ? HELPER.api.delete : config.url,
                            data: $.extend(config.data, {
                                // //token_csrf: Cookies.get(CSRF_NAME)
                            }),
                            type: (config.type == null) ? 'POST' : config.type,
                            complete: function (response) {

                                if (config.resultMessage) {
                                    HELPER.showMessage({
                                        success: response.success,
                                        title: (response.success) ? 'Success' : 'Failed',
                                        message: response.message
                                    });
                                }

                                config.callback(response);
                                HELPER.unblock(500);
                            }
                        });
                    }
                    else {
                        config.callback(result);
                    }
                }
            });
           
        },

        prompt: function (config) {
            config = $.extend(
                true,
                {
                    title: null,
                    inputType: null,
                    confirmLabel: '<i class="fa fa-check"></i> Yes',
                    confirmClassName:
                        "btn btn-focus btn-success m-btn m-btn--pill m-btn--air",
                    cancelLabel: '<i class="fa fa-times"></i> No',
                    cancelClassName:
                        "btn btn-focus btn-danger m-btn m-btn--pill m-btn--air",
                    inputOptions: null,
                    html: "",
                    size: null,
                    type: "info",
                    message: null,
                    callback: function () {},
                },
                config
            );

            Swal.fire({
                title: config.title != null ? config.title : "Information",
                input: config.inputType,
                text: config.message,
                html: config.html,
                icon: config.type,
                confirmButtonText: config.confirmLabel,
                confirmButtonClass: config.confirmClassName,

                reverseButtons: true,
                showCancelButton: true,
                cancelButtonText: config.cancelLabel,
                cancelButtonClass: config.cancelClassName,
            }).then(function (result) {
                config.callback(result);
            });
        },

        toExcel: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    title: null,
                },
                config
            );

            if (config.el.constructor === Array) {
                $.each(config.el, function (i, v) {
                    if (i == 0) {
                        tableToExcel(v, config.title);
                    } else {
                        tableToExcel(v, config.title + "-" + (i + 2));
                    }
                });
            } else {
                tableToExcel(config.el, config.title);
            }
        },

        addText: function (elemento, valor) {
            var elemento_dom = document.getElementById(elemento);
            if (document.selection) {
                elemento_dom.focus();
                sel = document.selection.createRange();
                sel.text = valor;
                return;
            }
            if (
                elemento_dom.selectionStart ||
                elemento_dom.selectionStart == "0"
            ) {
                var t_start = elemento_dom.selectionStart;
                var t_end = elemento_dom.selectionEnd;
                var val_start = elemento_dom.value.substring(0, t_start);
                var val_end = elemento_dom.value.substring(
                    t_end,
                    elemento_dom.value.length
                );
                elemento_dom.value = val_start + valor + val_end;
            } else {
                elemento_dom.value += valor;
            }
        },

        months: function (index, short = false, indo = "en") {
            var month1 = {
                en: [
                    "",
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                in: [
                    "",
                    "Januari",
                    "Februari",
                    "Maret",
                    "April",
                    "Mei",
                    "Juni",
                    "Juli",
                    "Agustus",
                    "September",
                    "Oktober",
                    "November",
                    "Desember",
                ],
            };
            var month2 = {
                in: [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
                in: [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "Mei",
                    "Jun",
                    "Jul",
                    "Agu",
                    "Sep",
                    "Okt",
                    "Nov",
                    "Des",
                ],
            };
            var month = "";
            if (short) {
                month = month2[indo][index];
            } else {
                month = month1[indo][index];
            }
            return month;
        },

        days: function (index, short = false) {
            var day1 = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];
            var day2 = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
            var day = "";
            if (short) {
                day = day2[index.getDay()];
            } else {
                day = day1[index.getDay()];
            }
            return day;
        },

        reset_format: function (_number) {
            var number = numeral(_number.toString().replace(/,/g, ""));
            return number.value();
        },

        number_format: function (_number) {
            if (_number == null || isNaN(_number)) {
                _number = 0;
            }

            var number = numeral(_number.toString().replace(/,/g, ""));
            var num = number.format("0,0.00");
            return num;
        },

        toInteger: function (_number, _default = 0) {
            return isNaN(parseInt(_number, 10))
                ? _default
                : parseInt(_number, 10);
        },

        toFixed: function (n, fixed) {
            return `${n}`.match(new RegExp(`^-?\\d+(?:\.\\d{0,${fixed}})?`))[0];
        },

        protect_email: function (user_email) {
            var avg, splitted, part1, part1_2, part2, part2_1, part3;
            splitted = user_email.split("@");
            part1 = splitted[0];
            avg = part1.length / 2;
            length = part1.length;
            part1 = part1.substring(0, part1.length - avg);
            part1_2 = "";
            for (var i = 0; i <= length - avg; i++) {
                part1_2 += "*";
            }
            part2 = splitted[1].split(".");
            part3 = part2.pop();
            part2 = part2.join("");
            avg = part2.length / 2;
            length = part2.length;
            part2 = part2.substring(0, part2.length - avg);
            part2_2 = "";
            for (var i = 0; i <= length - avg; i++) {
                part2_2 += "*";
            }
            return part1 + part1_2 + "@" + part2 + part2_2 + "." + part3;
        },

        colorIsDark: function (color) {
            if (color.match(/^rgb/)) {
                color = color.match(
                    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
                );
                r = color[1];
                g = color[2];
                b = color[3];
            } else {
                color = +(
                    "0x" +
                    color.slice(1).replace(color.length < 5 && /./g, "$&$&")
                );
                r = color >> 16;
                g = (color >> 8) & 255;
                b = color & 255;
            }
            hsp = Math.sqrt(
                0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)
            );
            if (hsp > 127.5) {
                return false;
            } else {
                return true;
            }
        },

        text_truncate: function (str, length = null, ending = null) {
            str = HELPER.nullConverter(str);
            if (length == null) length = 100;
            if (ending == null) ending = "...";
            if (str.length > length) {
                return str.substring(0, length - ending.length) + ending;
            } else {
                return str;
            }
        },

        textMore: function (config) {
            config = $.extend(
                true,
                {
                    text: "-",
                    length: 50,
                    ending: "...",
                    btn_text: "Lihat banyak",
                    btn_text_reverse: "Lihat sedikit",
                    reverse: false,
                    fromReverse: false,
                    from: 1,
                    callbackClick: function () {},
                },
                config
            );
            var str = HELPER.nullConverter(config.text);
            var btn_click = "";
            var btn_click_reverse = "";
            if (str.length > config.length) {
                try {
                    if (config.reverse) {
                        if (config.fromReverse) {
                            config.fromReverse = false;
                            btn_click = `<a href="javascript:void(0)" data-config="${btoa(
                                JSON.stringify(config)
                            )}" onclick="HELPER.clickTextMore(this)" title="${
                                config.btn_text_reverse
                            }">${config.btn_text_reverse}</a>`;
                            str = config.text + " " + btn_click;
                        } else {
                            config.fromReverse = true;
                            var temp_str = HELPER.text_truncate(
                                config.text,
                                config.length,
                                config.ending
                            );
                            btn_click = `<a href="javascript:void(0)" data-config="${btoa(
                                JSON.stringify(config)
                            )}" onclick="HELPER.clickTextMore(this)" title="${
                                config.btn_text
                            }">${config.btn_text}</a>`;
                            str = temp_str + " " + btn_click;
                        }
                    } else {
                        if (config.from) {
                            var temp_str = HELPER.text_truncate(
                                config.text,
                                config.length,
                                config.ending
                            );
                            btn_click = `<a href="javascript:void(0)" data-config="${btoa(
                                JSON.stringify(config)
                            )}" onclick="HELPER.clickTextMore(this)" title="${
                                config.btn_text
                            }">${config.btn_text}</a>`;
                            str = temp_str + " " + btn_click;
                        } else {
                            str = config.text;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            var temp_span = `<span style="white-space:normal;" title="${config.text}">${str}</span>`;
            return temp_span;
        },

        clickTextMore: function (el) {
            if ($(el).data().hasOwnProperty("config")) {
                var config = JSON.parse(atob($(el).data("config")));
                config.from = 0;
                $(el).parent().html(HELPER.textMore(config));
            }
        },

        arrayUnique: function (array) {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j]) a.splice(j--, 1);
                }
            }
            return a;
        },

        setMaxLength: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    modal: false,
                    maxlength: null,
                },
                config
            );

            if (config.el !== null) {
                var append = false;
                if (config.modal) {
                    append = true;
                }
                if (config.el.constructor === Array) {
                    $.each(config.el, function (i, v) {
                        if (config.maxlength !== null) {
                            $(v).attr("maxlength", config.maxlength);
                        }
                        $(v).maxlength({
                            warningClass:
                                "kt-badge kt-badge--warning kt-badge--rounded kt-badge--inline",
                            limitReachedClass:
                                "kt-badge kt-badge--success kt-badge--rounded kt-badge--inline",
                            appendToParent: append,
                            threshold: 10,
                        });
                    });
                } else {
                    if (config.maxlength !== null) {
                        $(config.el).attr("maxlength", config.maxlength);
                    }
                    $(config.el).maxlength({
                        warningClass:
                            "kt-badge kt-badge--warning kt-badge--rounded kt-badge--inline",
                        limitReachedClass:
                            "kt-badge kt-badge--success kt-badge--rounded kt-badge--inline",
                        appendToParent: append,
                        threshold: 10,
                    });
                }
            }
        },

        phoneNumber: function (
            number = null,
            inputMasking = false,
            withStyle = false
        ) {
            if (number != null) {
                var firstLetter = number.charAt(0);
                if (inputMasking === true) {
                    if (firstLetter == "0") {
                        number = number.substring(1);
                    } else if (firstLetter == "+") {
                        number = number.substring(3);
                    }
                } else {
                    if (firstLetter != "+")
                        number =
                            firstLetter == 0
                                ? `+62${number.substring(1)}`
                                : `+62${number}`;
                    if (withStyle === true) {
                        var numberLength = number.length;
                        var newNumber = "";
                        for (let i = 0; i < numberLength; i++) {
                            if (i == 3) {
                                newNumber += ` ${number.charAt(i)}`;
                            } else if (i == 6) {
                                newNumber += `-${number.charAt(i)}`;
                            } else if (i == 10) {
                                newNumber += `-${number.charAt(i)}`;
                            } else {
                                newNumber += number.charAt(i);
                            }
                        }
                        number = newNumber;
                    }
                }
            }
            return number;
        },

        initLoadMore: function (config) {
            config = $.extend(
                true,
                {
                    el: window,
                    perPage: 10,
                    urlExist: null,
                    dataExist: {},
                    callbackExist: function () {},
                    urlMore: null,
                    dataMore: {},
                    type: "POST",
                    callbackMore: function () {},
                    callbackEnd: function () {},
                    callLoadMore: function () {},
                    callBeforeLoad: function () {},
                    callAfterLoad: function () {},
                    cekLoadMore: function () {},
                    countCek: function () {},
                },
                config
            );

            var total_record_data = 0;
            var total_group_data = 0;

            if (config.urlExist !== null) {
                $.ajax({
                    url: config.urlExist,
                    data: $.extend(config.dataExist, {
                        // //token_csrf: Cookies.get(CSRF_NAME)
                    }),
                    type: config.type,
                    complete: function (response) {
                        var data = $.parseJSON(response.responseText);
                        var myQueue = new Queue();
                        myQueue
                            .enqueue(function (next) {
                                if (data.hasOwnProperty("success")) {
                                    total_group_data = 0;
                                } else {
                                    total_group_data = data;
                                }
                                config.callbackExist(data);
                                config.callLoadMore();
                                next();
                            }, "1")
                            .enqueue(function (next) {
                                setTimeout(function () {
                                    config.scrollCek(config.callLoadMore);
                                }, 300);
                                next();
                            }, "2")
                            .dequeueAll();
                    },
                    error: function (error) {
                        HELPER.unblock();
                        var err = error.responseJSON;
                        if (
                            (Array.isArray(err) || typeof err === "object") &&
                            err.success == false &&
                            err.hasOwnProperty("code")
                        ) {
                            HELPER.showMessage({
                                success: false,
                                message: err.message,
                                allowOutsideClick: false,
                                callback: function () {
                                    if (err.code == "401") {
                                        window.location.reload();
                                    }
                                },
                            });
                        }
                    },
                });
            } else {
                var response = {
                    success: false,
                    message: "Url kosong",
                };
                config.callback(response);
            }

            config.callLoadMore = function () {
                if (total_record_data <= total_group_data) {
                    var heightWindow = window.scrollY;
                    config.callBeforeLoad();
                    $.ajax({
                        url: config.urlMore,
                        data: $.extend(config.dataMore, {
                            ////token_csrf: Cookies.get(CSRF_NAME),
                            start: total_record_data,
                            limit: config.perPage,
                        }),
                        type: config.type,
                        complete: function (responseMore) {
                            var dataMore = responseMore;
                            var myQueueMore = new Queue();
                            myQueueMore
                                .enqueue(function (next) {
                                    total_record_data += config.perPage;
                                    next();
                                }, "1m")
                                .enqueue(function (next) {
                                    config.callbackMore(dataMore);
                                    if (total_record_data >= total_group_data) {
                                        config.callbackEnd(dataMore);
                                    }
                                    next();
                                }, "2m")
                                .enqueue(function (next) {
                                    window.scrollTo(0, heightWindow);
                                    config.callAfterLoad();
                                    next();
                                }, "3m")
                                .dequeueAll();
                        },
                        error: function (error) {
                            HELPER.unblock();
                            var err = error.responseJSON;
                            if (
                                (Array.isArray(err) ||
                                    typeof err === "object") &&
                                err.success == false &&
                                err.hasOwnProperty("code")
                            ) {
                                HELPER.showMessage({
                                    success: false,
                                    message: err.message,
                                    allowOutsideClick: false,
                                    callback: function () {
                                        if (err.code == "401") {
                                            window.location.reload();
                                        }
                                    },
                                });
                            }
                        },
                    });
                }
            };
        },

        unsetArray: function (arr, item) {
            var index = arr.indexOf(item);
            if (index !== -1) arr.splice(index, 1);
            return arr;
        },

        populateForm: function (frm, data) {
            $.each(data, function (key, value) {
                var $ctrl = $('[name="' + key + '"]', frm);
                if ($ctrl.is("select")) {
                    if ($ctrl.data().hasOwnProperty("select2")) {
                        $ctrl.val(value).trigger("change");
                    } else {
                        $("option", $ctrl).each(function () {
                            if (this.value == value) {
                                this.selected = true;
                            }
                        });
                    }
                } else if ($ctrl.is("textarea")) {
                    if (typeof $ctrl.data("_inputmask_opts") != "undefined") {
                        var inputmask_opt = $ctrl.data("_inputmask_opts");
                        if (inputmask_opt.hasOwnProperty("digits")) {
                            $ctrl.val(parseFloat(value));
                        } else {
                            $ctrl.val(value);
                        }
                    } else if (
                        typeof $ctrl.data("mousewheelLineHeight") != "undefined"
                    ) {
                        if (value != "" && value.length > 5) {
                            $ctrl.clockTimePicker(
                                "value",
                                value.substring(0, 5)
                            );
                        } else {
                            $ctrl.val(value);
                        }
                    } else {
                        $ctrl.val(value);
                    }
                } else {
                    switch ($ctrl.attr("type")) {
                        case "text":
                        case "date":
                        case "email":
                        case "number":
                        case "hidden":
                        case "color":
                            if (
                                typeof $ctrl.data("_inputmask_opts") !=
                                "undefined"
                            ) {
                                var inputmask_opt =
                                    $ctrl.data("_inputmask_opts");
                                if (inputmask_opt.hasOwnProperty("digits")) {
                                    $ctrl.val(parseFloat(value));
                                } else {
                                    $ctrl.val(value);
                                }
                            } else if (
                                typeof $ctrl.data("mousewheelLineHeight") !=
                                "undefined"
                            ) {
                                if (value != "" && value.length > 5) {
                                    $ctrl.clockTimePicker(
                                        "value",
                                        value.substring(0, 5)
                                    );
                                } else {
                                    $ctrl.val(value);
                                }
                            } else {
                                $ctrl.val(value);
                            }
                            break;
                        case "radio":
                        case "checkbox":
                            $ctrl.each(function () {
                                if ($(this).attr("value") == value) {
                                    $(this).prop("checked", true);
                                } else {
                                    $(this).prop("checked", false);
                                }
                            });
                            break;
                    }
                }
            });
        },

        detailmodal: function (modal, data) {
            $.each(data, function (key, value) {
                $(".detail-" + key).html(value);
            });
            if (modal) {
                $(modal).modal("show");
            }
        },

        cropImage: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    aspectRatio: NaN,
                    cropBoxResizable: true,
                    viewMode: 0,
                    minCropBoxWidth: 0,
                    callbackSetCrop: function () {},
                },
                config
            );

            var elId = $(config.el).attr("id");
            var btnSetCrop = "btnSetCrop-" + elId;
            var modalCrop = "modalCrop-" + elId;
            var cropperImg;
            if ($("#" + modalCrop).length > 0) {
                $("#" + modalCrop).remove();
            }
            $("#kt_content").append(`
              <div class="modal fade" id="${modalCrop}" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                  <div class="modal-dialog modal-lg" role="document">
                      <div class="modal-content">
                          <div class="modal-header">
                              <h5 class="modal-title">Crop</h5>
                              <button type="button" class="btn btn-primary font-weight-bold" id="${btnSetCrop}">Crop</button>
                          </div>
                          <div class="modal-body" style="max-width: 90%">
                              <img src="" style="max-width:100%">
                          </div>
                      </div>
                  </div>
              </div>
          `);
            $(config.el).on("fileimageloaded", function (event, numFiles) {
                $("#" + modalCrop).off();
                $("#" + btnSetCrop).off();
                setTimeout(function () {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $("#" + modalCrop)
                            .find("img")
                            .attr("src", e.target.result);
                    };
                    reader.readAsDataURL(event.target.files[0]);
                    setTimeout(function () {
                        $("#" + modalCrop).modal("show");
                        $("#" + modalCrop).on("shown.bs.modal", function () {
                            var image = $("#" + modalCrop).find("img")[0];
                            if (cropperImg) {
                                image = $("#" + modalCrop)
                                    .find("img")
                                    .attr("src");
                                cropperImg.replace(image);
                            } else {
                                cropperImg = new Cropper(image, config);
                            }
                            $("#" + btnSetCrop).on("click", function () {
                                var result = cropperImg
                                    .getCroppedCanvas()
                                    .toDataURL();
                                cropperImg
                                    .getCroppedCanvas()
                                    .toBlob(function (blob) {
                                        config.callbackSetCrop(blob);
                                    });
                                setTimeout(function () {
                                    $('[id="' + numFiles + '"]')
                                        .find("img")
                                        .attr("src", result);
                                    $("#" + modalCrop).modal("hide");
                                }, 300);
                            });
                        });
                    }, 300);
                }, 300);
            });
        },

        convertK: function (num, digits = 1, lang = "id") {
            var si = [
                {
                    value: 1,
                    symbol: "",
                },
                {
                    value: 1e3,
                    symbol: lang == "id" ? "rb" : "k",
                },
                {
                    value: 1e6,
                    symbol: lang == "id" ? "jt" : "M",
                },
                {
                    value: 1e9,
                    symbol: lang == "id" ? "M" : "G",
                },
                {
                    value: 1e12,
                    symbol: lang == "id" ? "T" : "T",
                },
                {
                    value: 1e15,
                    symbol: lang == "id" ? "P" : "P",
                },
                {
                    value: 1e18,
                    symbol: lang == "id" ? "E" : "E",
                },
            ];
            var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            var i;
            for (i = si.length - 1; i > 0; i--) {
                if (num >= si[i].value) {
                    break;
                }
            }
            return (
                (num / si[i].value).toFixed(digits).replace(rx, "$1") +
                si[i].symbol
            );
        },

        convertSimpleK: function (labelValue) {
            // Nine Zeroes for Billions
            return Math.abs(Number(labelValue)) >= 1.0e9
                ? Math.abs(Number(labelValue)) / 1.0e9 + "M"
                : // Six Zeroes for Millions
                Math.abs(Number(labelValue)) >= 1.0e6
                ? Math.abs(Number(labelValue)) / 1.0e6 + "Jt"
                : // Three Zeroes for Thousands
                Math.abs(Number(labelValue)) >= 1.0e3
                ? Math.abs(Number(labelValue)) / 1.0e3 + "Rb"
                : Math.abs(Number(labelValue));
        },

        isNull: function (val) {
            var retval = val;
            if (
                val === null ||
                val === "" ||
                typeof val == "undefined" ||
                val == "null" ||
                val.length == 0
            ) {
                return true;
            }
            return false;
        },

        ucwords: function (str = "") {
            str = HELPER.nullConverter(str);
            str = str.toLowerCase();
            return str.replace(/(\b)([a-zA-Z])/g, function (firstLetter) {
                return firstLetter.toUpperCase();
            });
        },

        autoPreviewYt: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    width: 560,
                    height: 315,
                    callback: function () {},
                },
                config
            );
            $(config.el)
                .off("change")
                .on("change", function () {
                    $(this)
                        .parent()
                        .find(".container-err-yt, .container-preview-yt")
                        .remove();
                    if (!HELPER.isNull(this.value)) {
                        if (HELPER.isUrl(this.value)) {
                            var idYt = HELPER.getIdYt(this.value);
                            if (!HELPER.isNull(idYt)) {
                                config.callback(idYt);
                                $(this).after(`
                              <div class="row w-100 mt-3 container-preview-yt text-center">
                                  <div class="col-12">
                                      <iframe width="${config.width}" height="${config.height}" src="https://www.youtube.com/embed/${idYt}" 
                                          title="YouTube video player" 
                                          frameborder="0" 
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                          allowfullscreen>
                                      </iframe>
                                  </div>
                              </div>
                          `);
                            } else {
                                $(this).after(
                                    '<span class="text-danger font-italic container-err-yt">URL tidak dapat digunakan !</span>'
                                );
                            }
                        } else {
                            $(this).after(
                                '<span class="text-danger font-italic container-err-yt">Harap input URL dengan benar !</span>'
                            );
                        }
                    }
                });
        },

        isUrl: function (link) {
            var url;
            try {
                url = new URL(link);
            } catch (e) {
                return false;
            }
            return true;
        },

        getIdYt: function (link) {
            var url = new URL(link);
            if (url.searchParams.has("v") && url.searchParams.get("v")) {
                return url.searchParams.get("v");
            } else if (
                url.hostname == "youtu.be" &&
                url.pathname &&
                url.pathname.length > 1
            ) {
                return url.pathname.substring(1);
            } else if (url.pathname.indexOf("embed") >= 0) {
                var idd = null;
                $.each(url.pathname.split("/"), function (i, v) {
                    if (!HELPER.isNull(v) && v != "embed") {
                        idd = v;
                    }
                });
                return idd;
            } else {
                return null;
            }
        },

        resetForm: function (form = "") {
            // $('input[type="radio"]').prop('checked', false);
            // $('input[type="checkbox"]').prop('checked', false);
            $(form)
                .find(
                    `textarea,input:not('[type="checkbox"], [type="radio"]'),select`
                )
                .val("")
                .change();
        },

        disableInput: function (form = "") {
            $(`${form} input,select,textarea`).attr("disabled", "disabled");
        },

        enableInput: function (form = "") {
            $(`${form} input,select,textarea`).removeAttr("disabled");
        },

        generateQR: function (config) {
            config = $.extend(
                true,
                {
                    el: null,
                    width: 300,
                    height: 300,
                    data: "http://localhost:8080/test",
                    margin: 0,
                    qrOptions: {
                        typeNumber: "0",
                        mode: "Byte",
                        errorCorrectionLevel: "Q",
                    },
                    imageOptions: {
                        hideBackgroundDots: true,
                        imageSize: 0.4,
                        margin: 5,
                    },
                    dotsOptions: {
                        type: "extra-rounded",
                        color: "#37b629",
                        gradient: null,
                    },
                    backgroundOptions: { color: "#ffffff" },
                    image: "/assets/media/qr-logo.png",
                    dotsOptionsHelper: {
                        colorType: { single: true, gradient: false },
                        gradient: {
                            linear: true,
                            radial: false,
                            color1: "#6a1a4c",
                            color2: "#6a1a4c",
                            rotation: "0",
                        },
                    },
                    cornersSquareOptions: {
                        type: "extra-rounded",
                        color: "#016d00",
                    },
                    cornersSquareOptionsHelper: {
                        colorType: { single: true, gradient: false },
                        gradient: {
                            linear: true,
                            radial: false,
                            color1: "#000000",
                            color2: "#000000",
                            rotation: "0",
                        },
                    },
                    cornersDotOptions: { type: "", color: "#016d00" },
                    cornersDotOptionsHelper: {
                        colorType: { single: true, gradient: false },
                        gradient: {
                            linear: true,
                            radial: false,
                            color1: "#000000",
                            color2: "#000000",
                            rotation: "0",
                        },
                    },
                    backgroundOptionsHelper: {
                        colorType: { single: true, gradient: false },
                        gradient: {
                            linear: true,
                            radial: false,
                            color1: "#ffffff",
                            color2: "#ffffff",
                            rotation: "0",
                        },
                    },
                },
                config
            );

            $("#" + config.el).html("");
            var qrCode = new QRCodeStyling(config);
            qrCode.append(document.getElementById(config.el));
            return qrCode;
        },

        downloadQR: function (config) {
            config = $.extend(
                true,
                {
                    name: "qr",
                    el: null,
                },
                config
            );
            var canvas = config.el;
            var dataURL = canvas.toDataURL("image/png");
            var link = $("<a>");
            link.attr("download", config.name + ".png");
            link.attr("href", dataURL);
            link[0].click();
        },

        genKey: function (length = 16) {
            const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(
                    Math.random() * characters.length
                );
                result += characters.charAt(randomIndex);
            }

            return result;
        },

        initToast: (config) => {
            config = $.extend(
                true,
                {
                    isCustom: false,
                    el: Date.now(),
                    html: ``,
                    autohide: true,
                    delay: 3000,
                    title: "Toast Title",
                    message: "Toast Message",
                    isLoading: false,
                    success: true,
                },
                config
            );

            let toastEL = ``;
            if (config.isCustom) {
                toastEL = config.html;
            } else {
                toastEL = `
                    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-kt-docs-toast="stack" data-bs-autohide="${
                        config.isLoading ? false : config.autohide
                    }" data-bs-delay="${config.delay}" id="toast_${config.el}">
                        <div class="toast-header">
                            <strong class="me-auto" id="toast_title_${
                                config.el
                            }">${config.title}</strong>
                            ${
                                config.isLoading
                                    ? ""
                                    : `<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`
                            }
                        </div>
                        <div class="toast-body d-flex align-items-center">
                            <span class="me-5" id="toast_status_${config.el}">${
                    config.isLoading
                        ? `<span class="spinner-border text-primary"></span>`
                        : config.success
                        ? `<i class="las la-check fs-2 text-primary"></i>`
                        : `<i class="las la-times fs-2 text-primary"></i>`
                }</span>
                    <span id="toast_message_${config.el}">
                        ${config.message}
                    </span>
                        </div>
                    </div>
            `;
            }
            $("#kt_docs_toast_stack_container").append(toastEL);
            return bootstrap.Toast.getOrCreateInstance(
                $("#" + $(toastEL).attr("id"))
            );
        },

        showToast: (instance) => {
            instance.show();
        },
        disposeToast: (instance) => {
            instance.dispose();
        },

        updateToast: (instance, config) => {
            config = $.extend(
                true,
                {
                    title: null,
                    el: null,
                    message: null,
                    success: null,
                },
                config
            );

            if (instance != null) {
                config.el = instance._element;
            }

            if (config.title != null)
                $(config.el).find('[id*="toast_title_"]').html(config.title);
            if (config.message != null)
                $(config.el)
                    .find('[id*="toast_message_"]')
                    .html(config.message);
            if (config.success != null)
                $(config.el)
                    .find('[id*="toast_status_"]')
                    .html(
                        config.success
                            ? `<i class="las la-check fs-2 text-primary"></i>`
                            : `<i class="las la-times fs-2 text-danger"></i>`
                    );
            setTimeout(() => {
                $(config.el).fadeOut();
            }, 2000);
            setTimeout(() => {
                $(config.el).remove();
            }, 2100);
        },
    };
})();

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || "");
        } else {
            o[this.name] = this.value || "";
        }
    });
    return o;
};

$.fn.randBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

var tableToExcel = (function () {
    var uri = "data:application/vnd.ms-excel;base64,",
        template =
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            });
        };
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table);
        var ctx = {
            worksheet: name || "Worksheet",
            table: table.innerHTML,
        };
        // window.location.href = uri + base64(format(template, ctx))
        var dataFormat = uri + base64(format(template, ctx));
        var $a = $("<a>");
        $a.attr("href", dataFormat);
        $("body").append($a);
        $a.attr("download", name + ".xls");
        $a[0].click();
        $a.remove();
    };
})();

function paperSize(data_tipe) {
    var tipe = data_tipe.toUpperCase();
    switch (tipe) {
        case "A4":
            return "21cm 29.7cm";
            break;
        case "LETTER":
            return "21.6cm 27.9cm";
            break;
        case "LEGAL":
            return "21.6cm 35.6cm";
            break;
        case "FOLIO":
            return "21.5cm 33.0cm";
            break;
        case "A0":
            return "84.1cm 118.9cm";
            break;
        case "A1":
            return "59.4cm 84.1cm";
            break;
        case "A2":
            return "42.0cm 59.4cm";
            break;
        case "A3":
            return "29.7cm 42.0cm";
            break;
        case "A4":
            return "21.0cm 29.7cm";
            break;
        case "A5":
            return "14.8cm 21.0cm";
            break;
        case "A6":
            return "10.5cm 14.8cm";
            break;
        case "A7":
            return "7.4cm 10.5cm";
            break;
        case "A8":
            return "5.2cm 7.4cm";
            break;
        case "A9":
            return "3.7cm 5.2cm";
            break;
        case "A10":
            return "2.6cm 3.7cm";
            break;
        case "B0":
            return "100.0cm 141.4cm";
            break;
        case "B1":
            return "70.7cm 100.0cm";
            break;
        case "B2":
            return "50.0cm 70.7cm";
            break;
        case "B3":
            return "35.3cm 50.0cm";
            break;
        case "B4":
            return "25.0cm 35.3cm";
            break;
        case "B5":
            return "17.6cm 25.0cm";
            break;
        case "B6":
            return "12.5cm 17.6cm";
            break;
        case "B7":
            return "8.8cm 12.5cm";
            break;
        case "B8":
            return "6.2cm 8.8cm";
            break;
        case "B9":
            return "4.4cm 6.2cm";
            break;
        case "B10":
            return "3.1cm 4.4cm";
            break;
    }
}

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};

function Queue() {
    this.queue = [];
}

Queue.prototype = {
    constructor: Queue,
    enqueue: function (fn, queueName) {
        this.queue.push({
            name: queueName || "global",
            fn:
                fn ||
                function (next) {
                    next();
                },
        });
        return this;
    },
    dequeue: function (queueName) {
        var allFns = !queueName
            ? this.queue
            : this.queue.filter(function (current) {
                  return current.name === queueName;
              });
        var poppedFn = allFns.pop();
        if (poppedFn) poppedFn.fn.call(this);
        return this;
    },
    dequeueAll: function (queueName) {
        var instance = this;
        var queue = this.queue;
        var allFns = !queueName
            ? this.queue
            : this.queue.filter(function (current) {
                  return current.name === queueName;
              });
        (function recursive(index) {
            var currentItem = allFns[index];
            if (!currentItem) return;
            currentItem.fn.call(instance, function () {
                queue.splice(queue.indexOf(currentItem), 1);
                recursive(index);
            });
        })(0);
        return this;
    },
};

$.fn.extend({
    donetyping: function (callback, timeout) {
        timeout = timeout || 1e3; // 1 second default timeout
        var timeoutReference,
            doneTyping = function (el) {
                if (!timeoutReference) return;
                timeoutReference = null;
                callback.call(el);
            };
        return this.each(function (i, el) {
            var $el = $(el);
            $el.off("keyup keypress paste blur change");
            $el.is(":input") &&
                $el
                    .on("keyup keypress paste", function (e) {
                        if (e.type == "keyup" && e.keyCode != 8) return;
                        if (timeoutReference) clearTimeout(timeoutReference);
                        timeoutReference = setTimeout(function () {
                            doneTyping(el);
                        }, timeout);
                    })
                    .on("blur", function () {
                        doneTyping(el);
                    })
                    .on("change", function () {});
        });
    },
});
