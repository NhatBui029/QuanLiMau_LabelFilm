const Admin = require('../../db/models/Mau');
const User = require('../../db/models/User');

class ClientController {
    // [GET /client]
    home(req, res, next) {
        res.render('client', { layout: 'mainClient' })
    }

    // [POST /client/tracuu]
    traCuu(req, res, next) {
        const min = 2;
        const max = 18;
        const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
        res.render('client', {
            layout: 'mainClient',
            tuoi: randomValue
        })
    }

}

module.exports = new ClientController();