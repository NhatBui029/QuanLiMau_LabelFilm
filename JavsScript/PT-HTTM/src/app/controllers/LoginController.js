const Mau = require('../../db/models/Mau');
const User = require('../../db/models/User');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const dotenv = require('dotenv')
const path = require('path');
const Nhan = require('../../db/models/Nhan');
const Readable = require('stream').Readable;
const Writable = require('stream').Writable;

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

    readJson(jsonPath) {
        let nhanList = [];

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
                        id: String(i),
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
        });
        return nhanList;
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

                if (number > 1 && number < 3 && path.extname(file) === '.mp4') {
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

}

module.exports = new LoginController();