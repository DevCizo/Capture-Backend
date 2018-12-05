const express = require('express');
const app = express();
const cors =  require('cors');
const morgan = require('morgan');
const bodyParser  = require('body-parser');
var path = require('path');

app.use(cors());
app.options('*', cors());

const upload  = require('express-fileupload');
const userRoutes = require('./api/routes/user-route');
const orderRoutes = require('./api/routes/order-route');
const bookRoutes = require('./api/routes/user-booking-route');
const photographerRoutes = require('./api/routes/photographer-route');

const helpers = require('./config/helper');
app.use(express.static(__dirname + '/node_modules')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/documents/')));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload());

app.use((res, req, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, XMLHttpRequest, Content-type, Accept, Authorization');
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //to give access to all the methods provided
        return res.status(200).json({});
       //return res.status(200).json({'success' : false, 'err' : 'OPTIONS Err.'});
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/index.html'))
})

app.get('/restart', function (req, res, next) {
    process.exit(1);
});

//Routes
app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/book', bookRoutes);
app.use('/photographer', photographerRoutes);

helpers.router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/index.html'));     
    res.status(200).end();
});


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 400;
    next(error);
});

// Error 
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message,
        success: false
    });
});

module.exports = app;
