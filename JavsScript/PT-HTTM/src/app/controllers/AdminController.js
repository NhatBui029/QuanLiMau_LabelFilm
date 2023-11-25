const modelNhan = require('../models/Nhan')
const modelMau = require('../models/Mau')
const formidable = require('formidable');
const fs = require('fs');
const util = require('../../public/util/mongoose')
const path = require('path');
const MauDAO = require('../daos/MauDAO');
const LabelDAO = require('../daos/LabelDAO');
const FrameDAO = require('../daos/FrameDAO');
const { executePython, saveImages, readImagesFromFolder } = require('./Helper')
const PAGE_MAX = 5;

class AdminController {
    // [GET /admin/]
    async home(req, res, next) {
        const page = parseInt(req.query.page);

        const count = await MauDAO.getCountAll();
        const maus = await MauDAO.getMauLimit(page, PAGE_MAX);

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
    }

    // [GET /admin/getAddMau]
    getAddMau(req, res, next) {
        res.render('addMau', { layout: 'main' })
    }

    // [POST /admin/getAddMau]
    addMau(req, res, next) {
        const imageFolder = 'D:\\HoccodePTIT\\JavsScript\\PT-HTTM\\dataset';
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            const { name } = fields;

            const videoFile = files.videoFile[0];
            const pathVideoFile = path.join('D:\\PT-HTTM\\Videos', videoFile.originalFilename);
            const result = await executePython('VideoToFrame.py', [pathVideoFile]);
            const list = await readImagesFromFolder(imageFolder);

            const videoBuffer = fs.readFileSync(videoFile.filepath);
            const mau = new modelMau(name[0].toString(), videoBuffer, list);
            await MauDAO.addMau(mau);

            res.redirect('/admin?page=1');
        });
    }

    async addLabel(req, res, next) {
        const pathImage1 = path.join('D:\\PT-HTTM\\Images', 'image1.jpg');
        const pathImage2 = path.join('D:\\PT-HTTM\\Images', 'image2.jpg');

        const kt = await saveImages('D:\\PT-HTTM\\Images', req.params.id1, req.params.id2);

        const mau = await MauDAO.getMauById(req.params.id1);
        const frame = mau.data.id(req.params.id2);
        const result = kt == 0 ? await executePython('AddLabel.py', [pathImage1, frame.data.length + 1, pathImage2]) : await executePython('AddLabel.py', [pathImage2, frame.data.length + 1, pathImage2]);
        const [x_left, y_left, x_right, y_right] = result[0].split(" ").map(coord => parseInt(coord, 10));
        const image2Buffer = fs.readFileSync(pathImage2);

        const nhan = new modelNhan('Label ' + (frame.data.length + 1).toString(), x_left, y_left, x_right, y_right);
        await LabelDAO.addLabel(req.params.id1, req.params.id2, nhan, image2Buffer);
        res.redirect(`/admin/viewFrame/${req.params.id1}/${req.params.id2}`);
    }

    async viewFrame(req, res, next) {
        const mau = await MauDAO.getMauById(req.params.id1);
        const frame = mau.data.find(frame => frame._id.toString() === req.params.id2);
        res.render('viewFrame', {
            layout: 'main',
            id1: req.params.id1,
            id2: req.params.id2,
            nameMau: mau.name,
            nameFrame: frame.name,
            dataLabel: util.multipleMongooseToObject(frame.data)
        })
    }

    async editLabel(req, res, next) {
        const kt = await saveImages('D:\\PT-HTTM\\Images', req.params.id1, req.params.id2);
        const pathImage1 = path.join('D:\\PT-HTTM\\Images', 'image1.jpg');
        const pathImage2 = path.join('D:\\PT-HTTM\\Images', 'image2.jpg');

        const nhanBefore = await LabelDAO.deleteLabel(req.params.id1, req.params.id2, req.params.id3);

        const listLabel = await LabelDAO.getListLabel(req.params.id1, req.params.id2);
        const stringRepresentation = listLabel.map(obj => JSON.stringify(obj)).join(',');
        const result = await executePython('EditImage.py', [pathImage1, stringRepresentation, pathImage2, nhanBefore.name]);
        const [x_left, y_left, x_right, y_right] = result[0].split(" ").map(coord => parseInt(coord, 10));

        const image2Buffer = fs.readFileSync(pathImage2);
        const nhan = new modelNhan(nhanBefore.name, x_left, y_left, x_right, y_right);
        await LabelDAO.addLabel(req.params.id1, req.params.id2, nhan, image2Buffer);

        res.redirect('back')
    }

    async deleteFrame(req, res, next) {
        await FrameDAO.deleteFrame(req.params.id1, req.params.id2);
        res.redirect('back')
    }

    async deleteLabel(req, res, next) {
        const pathImage1 = path.join('D:\\PT-HTTM\\Images', 'image1.jpg');
        const pathImage2 = path.join('D:\\PT-HTTM\\Images', 'image2.jpg');

        const kt = await saveImages('D:\\PT-HTTM\\Images', req.params.id1, req.params.id2);

        await LabelDAO.deleteLabel(req.params.id1, req.params.id2, req.params.id3);

        const listLabel = await LabelDAO.getListLabel(req.params.id1, req.params.id2);

        const stringRepresentation = listLabel.map(obj => JSON.stringify(obj)).join(',');
        const result = await executePython('ReDrawImage2.py', [pathImage1, stringRepresentation, pathImage2]);

        const image2Buffer = fs.readFileSync(pathImage2);
        await FrameDAO.updateImage2(req.params.id1, req.params.id2, image2Buffer);

        res.redirect('back');
    }


    // [GET /admin/viewMau/:id]
    async viewMau(req, res, next) {
        const mau = await MauDAO.getMauById(req.params.id);
        res.render('viewMau', {
            layout: 'main',
            mau: util.mongooseToObject(mau)
        })
    }

    // [GET /admin/deleteMau/:id]
    async getDeleteMau(req, res, next) {
        const mau = await MauDAO.getMauById(req.params.id);

        res.render('deleteMau', {
            layout: 'main',
            mau: util.mongooseToObject(mau)
        })
    }

    // [POST /admin/deleteMau/:id]
    async deleteMau(req, res, next) {
        await MauDAO.deleteMau(req.params.id);
        res.redirect('/admin');
    }

    // [POST /admin/search]
    async search(req, res, next) {
        const input = req.body.input;
        const maus = await MauDAO.searchMauByName(input);

        res.render('dsMau', {
            layout: 'main',
            maus: util.multipleMongooseToObject(maus)
        })
    }

    async getVideo(req, res, next) {
        const mau = await MauDAO.getMauById(req.params.id);
        res.contentType("video/mp4");
        res.send(mau.video);
    }

    async getImage(req, res, next) {
        const mau = await MauDAO.getMauById(req.params.id1);
        const frame = mau.data.find(frame => frame._id.toString() === req.params.id2);

        if (frame) {
            res.contentType('image/jpeg');
            res.send(frame.image2);
        } else {
            console.log('Không tìm thấy frame với id cụ thể');
        }

    }

}

module.exports = new AdminController();