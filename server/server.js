'use strict';                 // Use strict mode to enable ES6 : class, etc ...

// Prepare server environment
//==============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express

// REGISTER OUR ROUTES -------------------------------

// Retrieve a configured router object
var myrouter = require("./myrouter").myrouter();
app.use('/api', myrouter);

// Provide webtoken generation facilities
var aclrouter = require("./acl.js").aclrouter();
app.use('/jwt',aclrouter);

// START THE SERVER
// =============================================================================
var port = process.env.PORT || 8080;       // set our port
app.listen(port);
console.log('Waiting for connection on port ' + port);
