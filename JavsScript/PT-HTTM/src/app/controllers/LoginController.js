const User = require('../../db/models/User');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

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
}

module.exports = new LoginController();