const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');


const Nhan = new Schema({
    frame: {type: String},
    x_left: {type: Number},
    y_left: {type: Number},
    x_right: {type: Number},
    y_right: {type: Number},
    
});

module.exports = mongoose.model('Nhan',Nhan);
