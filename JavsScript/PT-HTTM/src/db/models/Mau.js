const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const Mau = new Schema({
    ten: {type: String},
    mota: {type: String},
    nhan: {type: String},
    video: {type: Buffer},
},{
    timestamps: true,
});

Mau.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})
module.exports = mongoose.model('Mau',Mau);
