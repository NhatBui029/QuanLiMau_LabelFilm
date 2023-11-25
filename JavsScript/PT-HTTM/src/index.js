const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const path = require('path');
const router = require('./routes/index')
const db = require('./db/index')
const cookieParser = require('cookie-parser')
const formidable = require('formidable');
const util = require('../src/public/util/mongoose')

db.connect();

app.use(
    express.urlencoded({
        extended: true,
    }),
    cookieParser(),
    express.json(),
    morgan('dev'),
    express.static(path.join(__dirname, 'public')),
);

app.engine(
    'hbs', 
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            formatDate: (date) => util.formatDate(date),
            equals: (number1 , number2) => number1 === number2,
        }
    }),
)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources','views'));

router(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})