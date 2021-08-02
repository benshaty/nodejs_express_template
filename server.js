// File dependencies
const express = require('express');
const session = require('express-session');
const apiRouter = require('./models/apiRouter');
const pages = require('./models/pages');
const db = require('./models/db');
const app = express();
const config = require('./config/config');
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");


/*
        Security Section
*/

// Prevent Dos attacks 
app.use(express.json({ limit: '10kb' })); // Body limit is 10

// Data Sanitization against XSS
app.use(xss());

// Creating a limiter by calling rateLimit function with options:
// max contains the maximum number of request and windowMs 
// contains the time in millisecond so only max amount of 
// request can be made in windowMS time.
const limiter = rateLimit({
    max: 100,
    windowMs: config.banTimer,
    message: `Too many request from this IP banned for ${config.banTimer/1000} seconds`
});
  
// Add the limiter function to the express middleware
// so that every request coming from user passes 
// through this middleware.
app.use(limiter);

/*
    Express setings
*/
// set the view engine
app.set('view engine', 'ejs');

// Return static page - index.html
//app.use(express.static(__dirname));

// access the public folder as root
app.use(express.static('public'));

// Use middlewares (app level - not controller level):
// this middleware takes the content of the request`s body, 
//and parses it to json format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*
    Locals and Sessions
*/
// setup local application data
app.use(function (req, res, next) {
    res.locals = config.locals;
    next();
 });


// this middleware takes care of the sessions
// cookie maxAge set in miliseconds 
// Ex. for 1 day
// 1 * 24 * 60 * 60 * 1000
// day * hour * minutes * seconds * miliseconds

app.use(session({
	secret: config.sessionPass,
	resave: true,
	saveUninitialized: true,
    rolling: true, // <-- Set `rolling` to `true`
    cookie: {
        maxAge: Date.now() +  (20 * 1000)
      }
}));

/*
    Routing and Error handling
*/

// error reporting
app.use(function (err, req, res, next) {
    console.log('This is the invalid field ->', err.field)
    next(err)
});

// add the models routes
app.use("/", pages);
app.use("/api", apiRouter);

// all other requests that not resolve any model
app.all('*', (req,res, next) => {
    res.status(403).render("pages/error403.ejs");
});

/*
    Server setup
*/

// set application port
// process.env.PORT is the setup when its on production.
const port = (process.env.PORT) ? process.env.PORT : config.port;

// Database connection and start webserver
db.connect(config.db)
.then(()=>{
        app.listen(port, () => { console.log(`Server is running in port ${port}`) });
    }
)
.catch((err)=>{
    console.log(err);
    process.exit();
});