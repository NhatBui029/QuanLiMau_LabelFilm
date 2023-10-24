const Admin = require('../../db/models/Mau');
const User = require('../../db/models/User');

class ClientController {
    // [GET /admin/]
    home(req, res, next){
        res.render('client', {layout: 'main'})
    }
    
}

module.exports = new ClientController();