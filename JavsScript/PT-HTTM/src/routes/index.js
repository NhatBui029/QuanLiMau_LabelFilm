const Login = require('./login');
const Admin = require('./admin');

function router(app){
    app.use('/admin',Admin);
    app.use('/',Login);
}

module.exports = router;