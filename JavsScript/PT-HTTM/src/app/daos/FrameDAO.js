const Mau = require('../../db/models/Mau');
const MauDAO = require('./MauDAO');

class FrameDAO{
    async updateImage2(id1, id2, image2){
        const mau = await MauDAO.getMauById(id1);
        const frame = mau.data.find(frame => frame._id.toString() === id2);
        frame.image2 = image2;
        await mau.save();
    }

    async deleteFrame(id1, id2){
        await Mau.findOneAndUpdate(
            { _id: id1 },
            { $pull: { data: { _id: id2 } } },
            { new: true }
        )
    }
}

module.exports = new FrameDAO();