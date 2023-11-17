const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const Frame = new Schema({
    name: {type: String},
    image: {type: Buffer},
    image2: {type: Buffer},
    contentType: {type: String}
});

const Nhan = new Schema({
    name : {type: String},
    data: {type: [Frame]}
});

module.exports = mongoose.model('Nhan',Nhan);
