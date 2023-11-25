const Mau = require('../../db/models/Mau')

class MauDAO {
    async getMauById(id) {
        return await Mau.findById(id);
    }

    async addMau(modelMau) {
        const mau = new Mau({
            name: modelMau.getName(),
            video: modelMau.getVideo(),
            data: modelMau.getData()
        });

        await mau.save()
    }

    async searchMauByName(input) {
        const maus = await Mau.find({
            $or: [
                { name: { $regex: new RegExp(input, 'i') } },
            ]
        })
        return maus;
    }
    
    async getCountAll(){
        return await Mau.countDocuments();
    }

    async getMauLimit(page_now,page_max){
        return await Mau.find({}).skip(page_max * (page_now - 1)).limit(page_max);
    }
    
    async deleteMau(id){
        await Mau.delete({ _id: id });
    }
}

module.exports = new MauDAO();