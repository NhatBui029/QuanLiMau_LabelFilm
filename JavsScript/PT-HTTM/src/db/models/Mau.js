const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Frame = new Schema({
    name: {type: String},
    image1: {type: Buffer},
    image2: {type: Buffer},
    contentType: {type: String},
    x_left: {type: Number},
    y_left: {type: Number},
    x_right: {type: Number},
    y_right: {type: Number},
});

const Mau = new Schema({
    name : {type: String},
    data: {type: [Frame]},
    video: {type: Buffer}
},{
    timestamps: true,
});

Mau.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})
module.exports = mongoose.model('Mau',Mau);
