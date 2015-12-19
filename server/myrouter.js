"use strict";

//==============================================================================
//              Route definitions for the application
//
//==============================================================================


var express = require('express');
var mymongo = require('./mongo/mymongo').mymongo();
var bodyParser = require("body-parser");
var acl = require("./acl");

 // get an instance of the express Router
 var router = express.Router();

 // Activate middleware for access control - authenticate all api calls to this router
 router.use(acl.aclauth());

 // this will let us get the data from a POST
 router.use(bodyParser.urlencoded({ extended: true }));
 router.use(bodyParser.json());

// Test mongo status
router.get('/status', (req,res) => {
    mymongo.status(  (stat) => {
      if(!stat) {
        res.status(500).json({'error':1});
        } else {
        res.json(stat);
        }
      }   );
});

// Get all records - based on logged in email
router.get('/poids',(req,res)=>{

    if(!req.payload.email) throw new Error("Cannot get an non logged in user !");
    var mail = req.payload.email;
    mymongo.ngFindAllFilter({"email":mail})
      .then((docs) => {
        //console.log("Returning database content for payload = ",req.payload,"\nDB Content : \n",docs);
        res.json(docs);
      });
});

// Post a record to upsert - based on loggedin email
router.post('/poids',(req,res)=>{
      //console.log("Preparing to update : ",req.body);

      // Refuse to update if no loogedIn user ...
      if(req.body.email != req.payload.email) {
          console.log("Attempting to update a different user ?! <",req.body.email,"> is not <", req.payload.email,">");
          res.status(401).json({"error":"Logged user differs from update user provided ?"});
      }
      mymongo.ngUpdate(req.body)
          .then((r)=>{
              //console.log("Successfully updated !");
              res.json(r);
              });
});

// Delete all collection
router.delete('/poids',(req,res)=>{
    mymongo.ngZapCol()
      .then((r)=>{res.json({"ok":1,"message":"Database was deleted !"});});
});


//==============================================================================
// Exporting the router object

exports.myrouter = function() {
  return router;
};
