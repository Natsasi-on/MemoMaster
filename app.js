const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const dotenv = require("dotenv");
const connectDB = require('./data/database');
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");

const app = express();
dotenv.config();
connectDB();



app.set('views', path.join(__dirname, "views"))
// app.set('public', path.join(__dirname, "public"))
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(expressLayouts);
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //create session in mongo for google
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //open this if want it to have login expire
    //keep user login 360000 s long
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
    //keep login for 7 days
    // Date.now() - 30 * 24 * 60 * 60 * 1000 
}));
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use('/', require('./routes/default'));
app.use('/', require('./routes/dashboard'));
app.use('/', require('./routes/auth'));

app.listen(3000, () => {
    console.log("listening on port 3000!")
})