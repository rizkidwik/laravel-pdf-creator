<div class="modal fade" id="modalBlog" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modelHeading">Tambah Data</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="form-blog" name="form-blog" class="form-horizontal" action="javascript:onSave()" method="POST">
                    @csrf
                    <input type="hidden" name="id" id="blog_id">
                    <div class="form-group">
                        <label for="name" class="col-sm-4 control-label">Title</label>
                        <div class="col-sm-12">
                            <input type="text" class="form-control" name="title" id="title" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="name" class="col-sm-4 control-label">Description</label>
                        <div class="col-sm-12">
                            <textarea class="form-control" name="description" id="description" required></textarea>
                        </div>
                    </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" >Save changes
                </button>
                </form>
            </div>
        </div>
    </div>
</div>
