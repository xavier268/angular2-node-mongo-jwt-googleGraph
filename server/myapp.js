"use strict";
/*============================================================================
                          Application setup
==============================================================================*/


// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express

// REGISTER OUR ROUTES -------------------------------

// Retrieve a configured router object
var myrouter = require("./myrouter").myrouter();
app.use('/api', myrouter);

// Provide webtoken generation facilities
// ( Make sure it is OUTSIDE of the protected scope ...)
var aclrouter = require("./acl").aclrouter();
app.use('/jwt',aclrouter);

// Register static route for client files
app.use(express.static("client"));
app.use("/dist",express.static("dist"));
app.use("/lib",express.static("bower_components"));
app.use("/node_modules",express.static("node_modules"));


// ========================= Export de l'appli ==============================
exports.app = function(){return app;};
