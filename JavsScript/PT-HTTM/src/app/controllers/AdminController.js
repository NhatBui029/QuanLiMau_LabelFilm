const Mau = require('../../db/models/Mau');
const formidable = require('formidable');
const fs = require('fs');
const util = require('../../public/util/mongoose')
const path = require('path');
const { spawn } = require('child_process')
const PAGE_MAX = 5;

const executePython = async (script, args) => {
    const arguments = args.map(arg => arg.toString());
    const py = spawn('python', [script, ...arguments]);

    return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';

        py.stdout.on('data', (data) => {
            output += data.toString();
        });

        py.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        py.on('exit', (code) => {
            if (code === 0) {
                resolve(output.trim().split('\n'));
            } else {
                console.error(`Python script exited with code ${code}`);
                reject(new Error(`Error executing Python script: ${errorOutput || 'Unknown error'}`));
            }
        });

        py.on('error', (err) => {
            console.error('Failed to start Python process:', err);
            reject(new Error('Failed to start Python process'));
        });
    });
};

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

    // async executePython(script, args) {
    //     const argumentss = args.map(arg => arg.toString());
    //     const py = spawn('python', [script, ...argumentss]);

    //     const result = await new Promise((resolve, reject) => {
    //         let output;

    //         py.stdout.on('data', (data) => {
    //             output = data.toString();
    //         })

    //         py.stderr.on('data', (data) => {
    //             console.error(`python error occured: ${data}`);
    //             reject(`error occured: ${script}`);
    //         })

    //         py.on('exit', (code) => {
    //             console.log(`child process exit with code ${code}`);
    //             resolve(output)
    //         })
    //     })
    //     return result;
    // }



    // [POST /admin/getAddMau]
    addMau(req, res, next) {
        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            const { name } = fields;

            const videoFile = files.videoFile[0];
            const pathVideoFile = path.join('D:\\PT-HTTM\\Videos', videoFile.originalFilename);
            console.log(pathVideoFile);
            const result = await executePython('VideoToFrame.py', [pathVideoFile]);

            const readImagesFromFolder = async (imageFolder) => {
                return new Promise((resolve, reject) => {
                    fs.readdir(imageFolder, (err, files) => {
                        if (err) {
                            console.error('Lỗi khi đọc thư mục hình ảnh:', err);
                            reject(err);
                            return;
                        }

                        const list = files.map((file) => {
                            const imagePath = path.join(imageFolder, file);
                            console.log(imagePath);
                            const imageName = file.split('.')[0];
                            const imageBuffer = fs.readFileSync(imagePath);
                            return {
                                name: imageName,
                                image1: imageBuffer,
                                contentType: 'image/jpeg'
                            };
                        });
                        resolve(list);
                    });
                });
            }

            const imageFolder = 'D:\\HoccodePTIT\\JavsScript\\PT-HTTM\\dataset';
            const list = await readImagesFromFolder(imageFolder);

            const videoBuffer = fs.readFileSync(videoFile.filepath);
            const mau = new Mau({
                name: name[0],
                video: videoBuffer,
                data: list
            });

            mau.save()
                .then(() => {
                    console.log(`Lưu mẫu ${name} vào MongoDB thành công.`);
                    res.redirect('/admin?page=1');
                })
                .catch(err => {
                    console.error('Lỗi khi lưu vào MongoDB:', err);
                    next(err);
                })
        });
    }

    // // [POST /admin/getAddMau]
    // addMau(req, res, next) {
    //     const form = new formidable.IncomingForm();

    //     form.parse(req, async (err, fields, files) => {
    //         const { name} = fields;

    //         const videoFile = files.videoFile[0];
    //         const pathVideoFile = path.join('D:\\PT-HTTM\\Videos', videoFile.originalFilename);
    //         console.log(pathVideoFile);
    //         const result = await executePython('main.py', [pathVideoFile]);

    //         const readFilePromise = (path) => {
    //             return new Promise((resolve, reject) => {
    //                 fs.readFile(path, (err, data) => {
    //                     if (err) {
    //                         reject(err);
    //                     } else {
    //                         resolve(data);
    //                     }
    //                 });
    //             });
    //         };

    //         const nhanList = [];
    //         const jsonData = await new Promise((resolve, reject) => {
    //             fs.readFile(pathJsonFile, 'utf8', (err, data) => {
    //                 if (err) {
    //                     console.error('Lỗi khi đọc tệp JSON:', err);
    //                     reject(err);
    //                 }
    //                 resolve(JSON.parse(data));
    //             });
    //         });

    //         for (const frameKey in jsonData) {
    //             const frameData = jsonData[frameKey];
    //             let listPerson = [];

    //             for (let i = 0; i < frameData.pedestriansData.length; i++) {
    //                 const personData = frameData.pedestriansData[i];
    //                 const person = {
    //                     id: "Person " + String(i + 1),
    //                     x_left: Number(personData[0]),
    //                     y_left: Number(personData[1]),
    //                     x_right: Number(personData[2]),
    //                     y_right: Number(personData[3])
    //                 };
    //                 listPerson.push(person);
    //             }

    //             const pathImage = path.join('D:\\HoccodePTIT\\JavsScript\\PT-HTTM\\dataset', frameKey + '.jpg');
    //             try {
    //                 const imageData = await readFilePromise(pathImage);
    //                 nhanList.push({
    //                     frame: frameKey,
    //                     person: listPerson,
    //                     image: imageData
    //                 });
    //             } catch (err) {
    //                 console.error('Lỗi khi đọc hình ảnh:', err);
    //             }
    //         }

    //         nhanList.sort((a, b) => {
    //             const frameA = parseInt(a.frame.split('_')[1]);
    //             const frameB = parseInt(b.frame.split('_')[1]);
    //             return frameA - frameB;
    //         });

    //         const videoBuffer = fs.readFileSync(videoFile.filepath);

    //         const mau = new Mau({
    //             ten: tenMau[0],
    //             mota: moTa[0],
    //             nhan: nhanList,
    //             fileNhan: jsonFile.originalFilename,
    //             video: videoBuffer
    //         });

    //         try {
    //             await mau.save();
    //             console.log(`Lưu mẫu ${tenMau} vào MongoDB thành công.`);
    //             res.redirect('/admin?page=1');
    //         } catch (err) {
    //             console.error('Lỗi khi lưu vào MongoDB:', err);
    //             next(err);
    //         }
    //     });
    // }

    async addLabel(req, res, next) {
        const saveImages = async (savePath, mauId, frameId) => {
            try {
                const mau = await Mau.findById(mauId);
                const frame = mau.data.find(frame => frame._id.toString() === frameId);

                if (!frame) {
                    console.log('Frame not found');
                    return;
                }

                if (frame.image1) {
                    const image1Path = path.join(savePath, 'image1.jpg');
                    fs.writeFileSync(image1Path, frame.image1);
                    console.log(`Image1 saved to: ${image1Path}`);
                }

                if (frame.image2) {
                    const image2Path = path.join(savePath, 'image2.jpg');
                    fs.writeFileSync(image2Path, frame.image2);
                    console.log(`Image2 saved to: ${image2Path}`);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        saveImages('D:\\PT-HTTM\\Images', req.params.id1, req.params.id2);

        const pathImage1 = path.join('D:\\PT-HTTM\\Images', 'image1.jpg');
        const pathImage2 = path.join('D:\\PT-HTTM\\Images', 'image2.jpg');
        const result = await executePython('AddLabel.py', [pathImage1]);
        const [x_left, y_left, x_right, y_right] = result[0].split(" ").map(coord => parseInt(coord, 10));
        const image2Buffer = fs.readFileSync(pathImage2);

        Mau.findById(req.params.id1)
            .then(mau => {
                const frame = mau.data.id(req.params.id2);
                frame.x_left = x_left;
                frame.y_left = y_left;
                frame.x_right = x_right;
                frame.y_right = y_right;
                frame.image2 = image2Buffer;

                mau.save()
                    .then(() => res.redirect('back'))
                    .catch(err => next(err))
            }).catch(err => {
                next(err)
            })
    }

    viewLabel(req, res, next) {
        Mau.findById(req.params.id1)
            .then(mau => {
                const frame = mau.data.find(frame => frame._id.toString() === req.params.id2);
                res.render('viewImage', {
                    layout: 'main',
                    id1: req.params.id1,
                    id2: req.params.id2,
                    nameMau: mau.name,
                    nameFrame: frame.name
                })
            }).catch(err => next(err))
    }

    editLabel(req, res, next) {
        //giống addlabel
    }

    deleteLabel(req, res, next) {
        Mau.findOneAndUpdate(
            { _id: req.params.id1 },
            { $pull: { data: { _id: req.params.id2 } } },
            { new: true }
        ).then(mau => res.redirect(`/admin/viewMau/${req.params.id1}`))
            .catch(err => next(err))
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
        })
            .then(() => {
                res.redirect('/admin?page=1')
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

    getVideo(req, res, next) {
        Mau.findById(req.params.id)
            .then(mau => {
                res.contentType("video/mp4");
                res.send(mau.video);
            }).catch(err => {
                next(err)
            })
    }

    getImage(req, res, next) {
        Mau.findById(req.params.id1)
            .then(mau => {
                const frame = mau.data.find(frame => frame._id.toString() === req.params.id2);
                if (frame) {
                    res.contentType(frame.contentType);
                    res.send(frame.image2);
                } else {
                    console.log('Không tìm thấy frame với id cụ thể');
                }

            }).catch()
    }

}

module.exports = new AdminController();