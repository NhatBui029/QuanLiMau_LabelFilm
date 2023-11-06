const Mau = require('../../db/models/Mau');
const formidable = require('formidable');
const fs = require('fs');
const util = require('../../public/util/mongoose')
const PAGE_MAX = 50;

class AdminController {
    // [GET /admin/]
    home(req, res, next) {
        const page = parseInt(req.query.page);

        Promise.all([
            Mau.find({}).skip(PAGE_MAX * (page - 1)).limit(PAGE_MAX),
            Mau.countDocuments()
        ])
            .then(([maus, count]) => {
                res.render('dsMau', {
                    layout: 'main',
                    maus: util.multipleMongooseToObject(maus),
                    pageNumber: page,
                    pageLeft: util.pageLeft(page),
                    pageRight: util.pageRight(page),
                    pagePrevious: page - 1,
                    pageNext: page + 1,
                    pageLast: parseInt(count / PAGE_MAX)
                })
            })
            .catch(next)
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

            const { tenMau, moTa, nhan } = fields;

            const videoFile = files.videoFile[0];
            // const videoData = fs.createReadStream(videoFile.filepath);
            console.log("hello", videoFile);
            console.log("hello", videoFile.filepath);
            const videoStream = fs.createReadStream(videoFile.filepath);
            let videoBuffer = Buffer.from([]);

            videoStream.on('data', (chunk) => {
                videoBuffer = Buffer.concat([videoBuffer, chunk]);
            });
            videoStream.on('end', () => {
                const newMau = new Mau({
                    ten: tenMau[0],
                    mota: moTa[0],
                    nhan: nhan[0],
                    video: videoBuffer,
                });

                newMau.save()
                    .then(() => {
                        res.redirect('/admin')
                    })
                    .catch(next);
            });

        });
    }

    // [GET /admin/viewMau/:id]
    viewMau(req, res, next) {
        Mau.findById(req.params.id)
            .then(mau => {
                res.render('viewMau', {
                    layout: 'main',
                    mau: util.mongooseToObject(mau)
                })
            })
            .catch(next)
    }

    // [GET /admin/editMau/:id]
    getEditMau(req, res, next) {
        Mau.findById(req.params.id)
            .then(mau => {
                res.render('editMau', {
                    layout: 'main',
                    mau: util.mongooseToObject(mau)
                })
            })
            .catch(next)
    }

    // [POST /admin/editMau/:id]
    editMau(req, res, next) {
        Mau.updateOne({ _id: req.params.id }, {
            mota: req.body.moTa,
            nhan: req.body.nhan,
        })
            .then(() => {
                res.redirect('/admin')
            })
            .catch(next)
    }

    // [GET /admin/deleteMau/:id]
    getDeleteMau(req, res, next) {
        Mau.findById(req.params.id)
            .then(mau => {
                res.render('deleteMau', {
                    layout: 'main',
                    mau: util.mongooseToObject(mau)
                })
            })
            .catch(next)
    }

    // [POST /admin/deleteMau/:id]
    deleteMau(req, res, next) {
        Mau.delete({ _id: req.params.id })
            .then(() =>
                res.redirect('/admin')
            ).catch(next)
    }

    // [POST /admin/search]
    search(req, res, next) {
        const input = req.body.input;

        Mau.find({
            $or: [
                { ten: { $regex: new RegExp(input, 'i') } },
                { mota: { $regex: new RegExp(input, 'i') } },
                { nhan: { $regex: new RegExp(input, 'i') } },
            ]
        })
            .then(maus => {
                res.render('dsMau', {
                    layout: 'main',
                    maus: util.multipleMongooseToObject(maus)
                })
            })
            .catch(next)
    }

    // [GET /admin/getVideo/:id]
    async getVideo(req, res, next) {
        try {
            const mau = await Mau.findById(req.params.id);
            if (!mau || !mau.video) {
                return res.status(404).json({ error: 'Không tìm thấy video.' });
            }

            res.setHeader('Content-Type', 'video/mp4');
            // res.setHeader('Content-Length', mau.video.length);
            res.end(mau.video);

        } catch (error) {
            res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu.' });
        }
    }
}

module.exports = new AdminController();