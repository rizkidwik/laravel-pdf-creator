<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>

    <title>Surat</title>

    <style>
        @page {
            margin-top: 0 px !important;
            margin-bottom: 0 px !important;

        }

        .styled-table {
            border-collapse: collapse;
            margin: 25px;
            font-size: 11px;

            min-width: 400px;
            width: 100%;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }

        .styled-table thead tr {
            background-color: #009879;
            color: #ffffff;
            text-align: left;
        }

        .styled-table th,
        .styled-table td {
            padding: 4px 7px;
        }

        .styled-table tbody tr {
            border-bottom: 1px solid #dddddd;
        }

        .styled-table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
        }

        .styled-table tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
        }
    </style>
</head>

<body style="font-size: 13px;">

    <div style="padding-left:50px;margin-right:50px ;" class="col-md-12">
        <table style="margin-left: 80px;margin-right:80px" class="table table-sm table-bordered">
            <tr>
                <td>Nama</td>
                <td>:</td>
                <td>{{ $vehicle->owner_name }}</td>
            </tr>
            <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>{{ $vehicle->owner_address }}</td>
            </tr>
            <tr>
                <td>Plat Nomor</td>
                <td>:</td>
                <td>{{ $vehicle->number_plate }}</td>
            </tr>
            <tr>
                <td>Nomor Rangka</td>
                <td>:</td>
                <td>{{ $vehicle->body_number }}</td>
            </tr>
        </table>
        <br>

        <br>
        <table width="100%">
            <tr>
                <td style="text-align: center;width:180px">
                </td>
                <td style="text-align: center;width:180px">

                </td>
                <td style="text-align: center">
                    Kediri,{{ date('d M Y') }}<br>
                    Kepala,
                    <br><br><br><br><br>

                    <u><b>NAMA</b></u>
                    <br>
                    NIP
                    <br>
                    <img style="z-index:800;position:absolute;margin-top:-100px;margin-left:50px;" class="img"
                        src="{{ public_path('img/ttd.png') }}" width="160">
                    {{-- <img style="z-index:920;position:relative;opacity:0.7;margin-top:-110px;margin-left:-150px" class="img" src="<?= $skl['stempel'] ?>" width="<?= $skl['wstempel'] ?>"> --}}
                </td>

            </tr>
        </table>
    </div>
</body>

</html>
