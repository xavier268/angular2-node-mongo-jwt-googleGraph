"use strict";

//==============================================================================
//              Route definitions for the server
//
//==============================================================================


var express = require('express');
var mymongo = require('./mongo/mymongo').mymongo();
var bodyParser = require("body-parser");

 // get an instance of the express Router
 var router = express.Router();

 // this will let us get the data from a POST
 router.use(bodyParser.urlencoded({ extended: true }));
 router.use(bodyParser.json());

// test route to make sure everything is working
router.get('/test', function(req, res) {
    res.json({ message: 'hooray! router was correctly configured !' });
});

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

// Get all records
router.get('/poids',(req,res)=>{
    mymongo.findAll(
      (docs) => {res.json(docs)}
    );
});

// Post a record to update
router.post('/poids',(req,res)=>{
      mymongo.update(
        req.body,
        (r)=>{res.json(r)}
      );
});

// Delete all collection
router.delete('/poids',(req,res)=>{
    mymongo.zapCol();
    res.json({"ok":1,"message":"Database was deleted !"});
});


//==============================================================================
// Exporting the router object

exports.myrouter = function() {
  return router;
}
