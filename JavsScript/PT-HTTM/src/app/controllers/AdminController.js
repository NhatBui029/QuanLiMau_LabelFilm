const Mau = require('../../db/models/Mau');
const formidable = require('formidable');
const fs = require('fs');

class AdminController {
    // [GET /admin/]
    home(req, res, next) {
        res.render('admin', { layout: 'main' })
    }

    // [GET /admin/getAddMau]
    getAddMau(req, res, next) {
        res.render('addMau', { layout: 'main' })
    }

    // [POST /admin/getAddMau]
    addMau(req, res, next) {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi khi xử lý tệp tải lên.' });
            }

            const {tenMau,moTa,nhan} = fields;

            const videoFile = files.videoFile[0];
            const videoData = fs.readFileSync(videoFile.filepath);
            console.log(videoFile.filepath);

            const newMau = new Mau({
                ten: tenMau[0],
                mota: moTa[0],
                nhan: nhan[0],
                video: videoData,
            });

            newMau.save()
                .then(() => {
                    res.status(200).json({ message: 'Mau đã được lưu vào MongoDB.' });
                })
                .catch(next);

        });
    }

}

module.exports = new AdminController();