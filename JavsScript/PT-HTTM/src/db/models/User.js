const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const User = new Schema({
    user: {type: String},
    password: {type: String},
    ten: {type: String},
    diachi: {type: String},
    email: {type: String},
    role: {type: String},
},{
    timestamps: true,
});

User.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})
module.exports = mongoose.model('User',User);
