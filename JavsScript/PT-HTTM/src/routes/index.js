const Login = require('./login');
const Admin = require('./admin');
const Client = require('./client');

function router(app){
    app.use('/admin',Admin);
    app.use('/client',Client);
    app.use('/',Login);
}

module.exports = router;