"use strict";

//==============================================================================
//                       Access control logic
//==============================================================================

var aclrouter = require("express").Router();
var jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");


var privateKey = "999";
var optionsign = {
      'algorithm':"HS256",
      'expiresIn': 60*3,  // 3 mns
      'issuer': "me"}
var optionverify = {
      'algorithm':"HS256",
      'issuer': "me"}

var access = { // base des mots des passe - format { user:password,...}
        "xavier" : "blandine",
        "xav":"dine"
      }

//==============================================================================
//                Private, internal helper functions
//==============================================================================

//------------------------------------------------------------------------------
// Check user credentials. Return payload ik ok, null if not.
// Adjust as needed to control access ...
function checkUser(user,password) {

  // Ultra simple user/password verification - ovrerride as needed !
  if(!user || !password) return null;

  if(access[user]!=password) return null;

  // return the payload will other credentials as needed ...
  return {'user':user, 'role':'Tout'} ;
}

//------------------------------------------------------------------------------
// Provides a webtoken as a string
function getToken (user, password) {

  var pl = checkUser(user,password);
  if(pl) {
    var r = jwt.sign(pl,privateKey,optionsign);
    return r;
  }else {
    return null;
    }
}

//------------------------------------------------------------------------------
// Returns the decoded payload if ok, null if not ok
function checkToken (t) {
  if(!t) return null;
  try {
    var decoded = jwt.verify(t,privateKey,optionverify);
    return decoded;
  } catch(err) {
    console.log("Token("+t+") was not recognized : ",err);
    return null;
  }
}

//==============================================================================
//                        Route management
// Verification is using the header "Authorization: Bearer xxxxx.yyy.zzzz"
// All routers access require a "Content-Type: application/json header".
//==============================================================================

// this will let us get the data from a POST
aclrouter.use(bodyParser.urlencoded({ extended: true }));
aclrouter.use(bodyParser.json());

// POST a webToken request.
// { user:lkjlkj, password:lkjlkjlkj } with Content-Type header: application/json
// or user and password as x-www-form-urlencoded values in POST body
// Returns text of the token.
aclrouter.post('/',(req,res)=>{
    console.log("Request jwt body : ",req.body);
    var token = getToken(req.body.user, req.body.password);
    res.send(token);
})

// Middleware - Validate header against jwt token and save payload in req.payload
function auth(req,res,next) {
  console.log("Checking for authentication header");
  var t = req.get("Authorization");
  t = t.replace(/^[ ]*Bearer[ ]+/,"");
  console.log("Token : <"+t+">");
  req.payload = checkToken(t);
  if(!req.payload ) {
    res.status(401).send("Not authorized !");
    }else {
    console.log("Authorized with",req.payload);
    next();
    }

}

//==============================================================================
// Provides the middleware to secure (VERIFY) any other router
exports.auth = auth;
// Provides the router that can GENERATES new tokens
exports.aclrouter = function(){return aclrouter;}
