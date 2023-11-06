const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Person = new mongoose.Schema({
    id: String,
    x_left: Number,
    y_left: Number,
    x_right: Number,
    y_right: Number
});

const Nhan = new mongoose.Schema({
    frame: String,
    person: [Person]
});

const Mau = new Schema({
    ten: String,
    mota: String,
    nhan: [Nhan],
    fileNhan: String,
    video: Buffer,
},{
    timestamps: true,
});

Mau.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})
module.exports = mongoose.model('Mau',Mau);
