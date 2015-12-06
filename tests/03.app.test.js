"use strict";
// jshint mocha:true

/*==============================================================================
                            Application testing
==============================================================================*/

describe("integration test of application",function(){

var supertest = require("supertest");
var expect = require("expect");

var app = require("../server/myapp").app();
var jwt;    // Generated token

var testCredentials = {"user":"test","password":"passwd"};

it("jwt token generation", function(done){
  supertest(app)
  .post("/jwt")
  .set("Content-Type","application/json")
  .send(testCredentials)
  .expect(200)
  .end(function(err,res){
      if(err) throw err;
      console.log("Token returned :",res.text);
      jwt = "Bearer "+ res.text;
      expect(jwt.length).toBeGreaterThan(50);
      done();
  });
});


it("get all records from db", function(done){
  supertest(app)
      .get("/api/poids")
      .set("Authorization",jwt)
      .set("Accept","application/json")
      .expect(200)
      .end(function(err,res){
        if(err) throw err;
        console.log("Success GET answer : ",res.text);
        expect(res.body[0].email).toBeTruthy();
        done();
            });
      });

}); // describe
