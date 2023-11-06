const { default: mongoose } = require("mongoose")

module.exports = {
    multipleMongooseToObject: (mongooses) => {
        return mongooses.map(mongoose => mongoose.toObject())
    },
    mongooseToObject: (mongoose) => {
        return mongoose ? mongoose.toObject() : mongoose
    },
    formatDate: (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    },
    pageLeft(page){
        const distance = 5;
        if(page>1 && page <6) return 1;
        else if(page > 3) return page - distance;
        else return 0;
    },
    pageRight(page){
        const distance = 5;
        return page + distance;
    },
}