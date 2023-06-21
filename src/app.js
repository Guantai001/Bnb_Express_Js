const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const airbnbRouter = require('./routes/airbnb');
const adminRouter = require('./routes/authAdmins');
const userRouter = require('./routes/authUser');
const bnbImageRouter = require('./routes/bnbImage');
const amenityRouter = require('./routes/amenities');
const reserveRouter = require('./routes/reservation');
const MongoStore = require('connect-mongo');


require('./database');
// require('./strategies/local');
require('./strategies/google');



app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store : MongoStore.create({mongoUrl: 'mongodb://localhost:27017/airbnb'}),
}));


// used to serve static files from public directory
app.use((req, res, next) => {
    console.log(`${req.method}:${req.url}`);
    next();
});


// Passport middleware

app.use(passport.initialize());
app.use(passport.session());




// Routes middleware
app.use('/api/airbnb', airbnbRouter);
app.use('/api/admin', adminRouter);  
app.use('/api/user', userRouter); 
app.use('/api/bnbimage', bnbImageRouter);   
app.use('/api/amenity', amenityRouter);               
app.use('/api/reservation', reserveRouter);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});