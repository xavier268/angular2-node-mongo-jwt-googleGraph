'use strict';                 // Use strict mode to enable ES6 : class, etc ...

// Prepare server environment
//==============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REGISTER OUR ROUTES -------------------------------
// Retrieve a configured router object
var router = require("./myrouter").myrouter();
// ... ad use it to configure the app
app.use('/api', router);

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080;       // set our port
app.listen(port);
console.log('Waiting for connection on port ' + port);
