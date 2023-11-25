const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Frame = new Schema({
    name: {type: String},
    image1: {type: Buffer},
    image2: {type: Buffer},
    contentType: {type: String},
    x_left: {type: Number},
    y_left: {type: Number},
    x_right: {type: Number},
    y_right: {type: Number},
},{
    timestamps: true,
});

Frame.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('Frame',Frame);
