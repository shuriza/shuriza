<?php $__env->startSection('content'); ?>
<!-- PAGE-HEADER -->
<div class="page-header">
    <h1 class="page-title">Barang Masuk</h1>
    <div>
        <ol class="breadcrumb">
            <li class="breadcrumb-item text-gray">Transaksi</li>
            <li class="breadcrumb-item active" aria-current="page">Barang Masuk</li>
        </ol>
    </div>
</div>
<!-- PAGE-HEADER END -->


<!-- ROW -->
<div class="row row-sm">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-header justify-content-between">
                <h3 class="card-title">Data</h3>
                <?php if($hakTambah > 0): ?>
                <div>
                    <a class="modal-effect btn btn-primary-light" onclick="generateID()" data-bs-effect="effect-super-scaled" data-bs-toggle="modal" href="#modaldemo8">Tambah Data
                        <i class="fe fe-plus"></i></a>
                </div>
                <?php endif; ?>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table id="table-1" class="table table-bordered text-nowrap border-bottom dataTable no-footer dtr-inline collapsed">
                        <thead>
                            <th class="border-bottom-0" width="1%">No</th>
                            <th class="border-bottom-0">Tanggal Masuk</th>
                            <th class="border-bottom-0">Kode Barang Masuk</th>
                            <th class="border-bottom-0">Kode Barang</th>
                            <th class="border-bottom-0">Customer</th>
                            <th class="border-bottom-0">Barang</th>
                            <th class="border-bottom-0">Jumlah Masuk</th>
                            <th class="border-bottom-0" width="1%">Action</th>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- END ROW -->

<?php echo $__env->make('Admin.BarangMasuk.tambah', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php echo $__env->make('Admin.BarangMasuk.edit', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php echo $__env->make('Admin.BarangMasuk.hapus', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php echo $__env->make('Admin.BarangMasuk.barang', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

<script>
    function generateID() {
        id = new Date().getTime();
        $("input[name='bmkode']").val("BM-" + id);
    }

    function update(data) {
        $("input[name='idbmU']").val(data.bm_id);
        $("input[name='bmkodeU']").val(data.bm_kode);
        $("input[name='kdbarangU']").val(data.barang_kode);
        $("select[name='customerU']").val(data.customer_id);
        $("input[name='jmlU']").val(data.bm_jumlah);

        getbarangbyidU(data.barang_kode);

        $("input[name='tglmasukU").bootstrapdatepicker({
            format: 'yyyy-mm-dd',
            autoclose: true
        }).bootstrapdatepicker("update", data.bm_tanggal);
    }

    function hapus(data) {
        $("input[name='idbm']").val(data.bm_id);
        $("#vbm").html("Kode BM " + "<b>" + data.bm_kode + "</b>");
    }

    function validasi(judul, status) {
        swal({
            title: judul,
            type: status,
            confirmButtonText: "Iya."
        });
    }
</script>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
<script>
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var table;
    $(document).ready(function() {
        //datatables
        table = $('#table-1').DataTable({

            "processing": true,
            "serverSide": true,
            "info": true,
            "order": [],
            "scrollX": true,
            "stateSave": true,
            "lengthMenu": [
                [5, 10, 25, 50, 100],
                [5, 10, 25, 50, 100]
            ],
            "pageLength": 10,

            lengthChange: true,

            "ajax": {
                "url": "<?php echo e(route('barang-masuk.getbarang-masuk')); ?>",
            },

            "columns": [{
                    data: 'DT_RowIndex',
                    name: 'DT_RowIndex',
                    searchable: false
                },
                {
                    data: 'tgl',
                    name: 'bm_tanggal',
                },
                {
                    data: 'bm_kode',
                    name: 'bm_kode',
                },
                {
                    data: 'barang_kode',
                    name: 'barang_kode',
                },
                {
                    data: 'customer',
                    name: 'customer_nama',
                },
                {
                    data: 'barang',
                    name: 'barang_nama',
                },
                {
                    data: 'bm_jumlah',
                    name: 'bm_jumlah',
                },
                {
                    data: 'action',
                    name: 'action',
                    orderable: false,
                    searchable: false
                },
            ],

        });
    });
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('Master.Layouts.app', ['title' => $title], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /Users/willyap/Sites/wordpress/Sistem-Persediaan-Laravel/resources/views/Admin/BarangMasuk/index.blade.php ENDPATH**/ ?>