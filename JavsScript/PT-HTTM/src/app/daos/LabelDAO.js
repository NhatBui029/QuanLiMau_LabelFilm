const Mau = require('../../db/models/Mau');
const MauDAO = require('./MauDAO');

class LabelDAO {
    async addLabel(id1, id2, modelNhan, image2Buffer) {
        const mau = await MauDAO.getMauById(id1);
        const frame = mau.data.id(id2);
        frame.data.push({
            name: modelNhan.getName(),
            x_left: modelNhan.getX_left(),
            y_left: modelNhan.getY_left(),
            x_right: modelNhan.getX_right(),
            y_right: modelNhan.getY_right()
        })
        frame.image2 = image2Buffer;

        await mau.save()
    }

    async deleteLabel(id1, id2, id3){
        const mauBefore = await Mau.findOneAndUpdate(
            { _id: id1, 'data._id': id2 },
            { $pull: { 'data.$.data': { _id: id3 } } }
        )
        const frameBefore = mauBefore.data.find(frame => frame._id.toString() === id2);
        const nhanBefore = frameBefore.data.find(nhan => nhan._id.toString() === id3);
        return nhanBefore;
    }

    async getListLabel(id1, id2){
        const mau = await MauDAO.getMauById(id1);
        const frame = mau.data.find(frame => frame._id.toString() === id2);
        let listLabel = []
        frame.data.forEach(nhan => {
            listLabel.push({
                name: nhan.name,
                x_left: nhan.x_left,
                y_left: nhan.y_left,
                x_right: nhan.x_right,
                y_right: nhan.y_right
            })
        })
        return listLabel;
    }
}

module.exports = new LabelDAO();