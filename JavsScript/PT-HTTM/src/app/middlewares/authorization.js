const User = require('../../db/models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config();

module.exports.requireUser = function (req, res, next) {
    try {
        const id = jwt.verify(req.cookies._id, process.env.ACCESS_TOKEN_SECRET);
        User.findById(id)
            .then(user => {
                if(user.role == 'user') next();
                else res.json('Please log in with your user account');
            })
            .catch(err => {

            })
    } catch (err) {
        res.status(500).json('Invalid token')
    }
}
module.exports.requireAdmin = function (req, res, next) {
    try {
        const id = jwt.verify(req.cookies._id, process.env.ACCESS_TOKEN_SECRET);
        User.findById(id)
            .then(user => {
                if(user.role == 'admin') next();
                else res.json('Please log in with your admin account');
            })
            .catch(err => {

            })
    } catch (err) {
        res.status(500).json('Invalid token')
    }
}