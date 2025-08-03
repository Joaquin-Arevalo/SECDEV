/* 
Functions:
-This is the file that will be run during deployment or locally hosted
-Session Creation and uploading to database
-Call to connect to the MongoDB database
-NPM packages utilized
-Trigger update weekly payroll on PST: Sunday 12am/ UTC: Saturday 4pm
-Redirect to login page
*/

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const schedule = require('node-schedule');
const axios = require('axios');

const routes = require('./routes/routes.js');
const database = require('./models/database.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

/*---- templates ----*/
app.set('view engine', 'hbs');
const partialsPath = path.join(__dirname, "views/partials");
hbs.registerPartials(partialsPath);
hbs.registerHelper('eq', function (a, b){
    return a === b;
});

/*----- security headers -----*/
app.use(helmet({ contentSecurityPolicy: false })); 
app.disable('x-powered-by');

/*----- parsers & static -----*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));

/*----- connect to db -----*/
database.connect();

/*----- session fail secure -----*/
app.set('trust proxy', 1);
app.use(session({
    secret: 'session-secret-key', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

/*----- routes -----*/
app.use('/', routes);

/*----- weekly payroll -----*/
//PST: Sunday 12am/ UTC: Saturday 4pm
schedule.scheduleJob('0 0 * * 0', function(){
    //add a try catch for error handling
    try{
        axios.post(`http://${hostname}:${port}/update_employee_payroll`, null, {
                headers: { 'x-cron-secret': process.env.CRON_SECRET }
        });

        console.log('[CRON] Payroll update triggered.');
    } catch (error){
        console.error("Error Updating Payroll:", error);
    }
});

/*----- ERROR 404 -----*/
app.use(function(req, res){
    res.status(404).send('Error 404: Page Not Found');
});

/*----- Generic Error Handler -----*/
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong.');
});

// addData.populateEmployees();
// addDataPayroll.populate_payroll();

/*----- start -----*/
app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}`);
}); 