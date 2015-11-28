"use strict";

//==============================================================================
//                            Access control logic
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

//------------------------------------------------------------------------------
// Provides a webtoken as a string
function getToken (user, password) {

  // Ignore user/password verification
  if(!user || !password) return null;

  var r = jwt.sign({'user':user},privateKey,optionsign);
  return r;
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
// Route management
//==============================================================================

// this will let us get the data from a POST
aclrouter.use(bodyParser.urlencoded({ extended: true }));
aclrouter.use(bodyParser.json());

// Post a webToken request. Format is { user:lkjlkj, password:lkjlkjlkj }
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
  t = t.replace("Bearer ","");
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
