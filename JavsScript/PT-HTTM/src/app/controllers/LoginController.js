const Mau = require('../../db/models/Mau');
const User = require('../../db/models/User');
const Nhan = require('../../db/models/Nhan');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const dotenv = require('dotenv')
const path = require('path');
const util = require('../../public/util/mongoose')

dotenv.config();

class LoginController {
    // [GET /]
    getLogin(req, res, next) {
        res.render('login', {
            layout: 'login'
        })
    }

    // [POST /login]
    login(req, res, next) {
        User.findOne({ user: req.body.user })
            .then((user) => {
                if (!user) {
                    res.render('login', {
                        layout: 'login',
                        error: 'Tài khoản không tồn tại',
                    });
                } else {
                    if (user.role === 'admin' && user.password === req.body.password) {
                        const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                        res.cookie('_id', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
                        res.redirect('/admin?page=1')
                    } else {
                        if (req.body.password !== user.password) {
                            res.render('login', {
                                layout: 'login',
                                error: 'Mật khẩu sai',
                                user: req.body.user,
                                password: req.body.password
                            });
                        }
                        else {
                            const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                            res.cookie('_id', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
                            res.redirect('/client')
                        }
                    }
                }

            })
            .catch(next)
    }

    // [POST /signup]
    signup(req, res, next) {
        User.findOne({ user: req.body.user })
            .then(user => {
                if (user) {
                    res.render('login', {
                        layout: 'login',
                        error1: 'Tài khoản đã tồn tại !!'
                    })
                } else {
                    const user = new User({
                        user: req.body.user,
                        password: req.body.password,
                        ten: req.body.ten,
                        diachi: req.body.diachi,
                        email: req.body.tuoi,
                        role: 'user'
                    })
                    user.save()
                        .then(() => {
                            res.redirect('/')
                        })
                        .catch(next)
                }
            })
            .catch(next)
    }

    logout(req, res, next) {
        res.clearCookie('_id');
        res.redirect('/');
    }

    read(req, res, next) {
        const self = this;
        const videoDirectory = 'D:\\download\\Videos';
        const JsonDirectory = 'D:\\download\\Annotations';

        fs.readdir(videoDirectory, (err, files) => {
            if (err) {
                console.error('Không thể đọc thư mục video:', err);
                return;
            }

            files.forEach(async (file) => {
                const match2 = file.match(/(\d+)\.mp4$/);
                const number = parseInt(match2[1], 10);

                if (number > 0 && number < 11 && path.extname(file) === '.mp4') {
                    const videoPath = path.join(videoDirectory, file);
                    const nameFile = file.split('.')[0];
                    const jsonPath = path.join(JsonDirectory, nameFile + '.json');

                    const videoStats = fs.statSync(videoPath);

                    if (videoStats.size > 1000 * 1024) {
                        console.log(`Bỏ qua video ${file} vì dung lượng lớn hơn 1000KB.`);
                        return;
                    }

                    const videoBuffer = fs.readFileSync(videoPath);

                    const match1 = file.match(/^(.*?)_\d+/);
                    let moTa = match1 ? match1[1] : "Unknow";

                    var nhanList = [];
                    fs.readFile(jsonPath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Lỗi khi đọc tệp JSON:', err);
                            return;
                        }

                        const jsonData = JSON.parse(data);


                        for (const frameKey in jsonData) {
                            const frameData = jsonData[frameKey];

                            let listPerson = [];
                            for (let i = 0; i < frameData.pedestriansData.length; i++) {
                                const personData = frameData.pedestriansData[i];
                                const person = {
                                    id: "Person " + String(i + 1),
                                    x_left: Number(personData[0]),
                                    y_left: Number(personData[1]),
                                    x_right: Number(personData[2]),
                                    y_right: Number(personData[3])
                                };
                                listPerson.push(person);
                            }
                            const nhan = {
                                frame: frameKey,
                                person: listPerson
                            }
                            nhanList.push(nhan);
                        }
                        nhanList.sort((a, b) => {
                            const frameA = parseInt(a.frame.split('_')[1]);
                            const frameB = parseInt(b.frame.split('_')[1]);
                            return frameA - frameB;
                        });

                        const mau = new Mau({
                            ten: nameFile,
                            mota: moTa,
                            nhan: nhanList,
                            fileNhan: nameFile + '.json',
                            video: videoBuffer
                        });

                        mau.save()
                            .then(() => {
                                console.log(`Lưu video ${nameFile} vào MongoDB thành công.`);
                            })
                            .catch(next)
                    });

                }
            });
        });
        res.json("Thành công")
    }



    test(req, res, next) {
        const nhan1 = new Nhan({
            frame: "frame_1",
            x_left: 100,
            y_left: 200,
            x_right: 300,
            y_right: 400,
        })

        const nhan2 = new Nhan({
            frame: "frame_1",
            x_left: 100,
            y_left: 200,
            x_right: 300,
            y_right: 400,
        })

        let nhanArray = []
        nhanArray.push(nhan1, nhan2);

        const newMau = new Mau({
            ten: "tesst2",
            mota: "hello",
            nhan: nhanArray,
            video: Buffer.from("D:\\download\\video7.mp4", 'base64'),
        });

        newMau.save().then(() => {
            res.send("thanh cong")
        }).catch(next)
    }

    async upload(req, res, next) {
        const imagePath1 = "D:\\HoccodePTIT\\JavsScript\\PT-HTTM\\dataset\\Frame_0000001.jpg";
        const imagePath2 = "D:\\HoccodePTIT\\JavsScript\\PT-HTTM\\dataset\\Frame_0000034.jpg";

        // Đọc ảnh từ đường dẫn
        const imageBuffer1 = fs.readFileSync(imagePath1);
        const imageBuffer2 = fs.readFileSync(imagePath2);

        let listData = []
        listData.push({
            name: 'frame1',
            image: imageBuffer1,
            contentType: 'image/jpeg'
        })
        listData.push({
            name: 'frame2',
            image: imageBuffer2,
            contentType: 'image/jpeg'
        })

        // Lưu ảnh vào MongoDB
        const nhan = new Nhan({
            name: 'test2',
            data: listData
        });

        await nhan.save();

        res.send('Image uploaded to MongoDB!');
    }

    viewNhan(req, res, next) {
        Nhan.findById('65562d0bc8e946442ef59a16')
            .then(nhan => {
                res.render('testView', {
                    layout: 'login',
                    nhan: util.mongooseToObject(nhan)
                })
            }).catch(next)
    }

    viewImage(req, res, next) {
        res.render('viewImage', {
            layout: 'login',
            id1: req.params.id1,
            id2: req.params.id2
        })
    }

    editImage(req, res, next) {
        const imagePath = "D:\\HoccodePTIT\\JavsScript\\PT-HTTM\\dataset\\Frame_0000090.jpg";
        const imageBuffer = fs.readFileSync(imagePath);

        Nhan.findById(req.params.id1)
            .then(nhan => {
                const frame = nhan.data.id(req.params.id2);
                frame.image2 = imageBuffer
                nhan.save();

                res.status(200).json({ message: 'Đã cập nhật image2 thành công' });
            }).catch(next)
    }

    getImage(req, res, next) {
        const frameID = req.params.id1;
        Nhan.findById(frameID)
            .then(nhan => {
                const frame = nhan.data.find(frame => frame._id.toString() === req.params.id2);
                if (frame) {
                    res.contentType(frame.contentType);
                    res.send(frame.image2);
                } else {
                    console.log('Không tìm thấy frame với id cụ thể');
                }

            }).catch()
    }
}

module.exports = new LoginController();