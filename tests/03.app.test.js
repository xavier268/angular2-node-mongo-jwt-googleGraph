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
var testRecord = {"email":"test@test.com","kg":222,"quand":"2010-05-06"};

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

it("should fail with invalid header",function(done) {
  supertest(app)
      .get("/api/poids")
      .set("Authorization",jwt+"xxxx")
      .set("Accept","application/json")
      .expect(401)
      .end(function(err,res){
        if(err) throw err;
        console.log("No header answer : ",res.text);
        done();
            });
      });


it("should fail with no header",function(done) {
  supertest(app)
      .get("/api/poids")
      //.set("Authorization",jwt)
      .set("Accept","application/json")
      .expect(401)
      .end(function(err,res){
        if(err) throw err;
        console.log("No header answer : ",res.text);
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
        //console.log("Success GET answer : ",res.text);
        expect(res.body).toBeAn(Array);
        done();
            });
      });



it("update a test record in real db", function(done){
  supertest(app)
      .post("/api/poids")
      .set("Authorization",jwt)
      .set("Accept","application/json")
      .send(testRecord)
      .expect(200)
      .end(function(err,res){
        if(err) throw err;
        //console.log("Success POST answer : ",res.text);
        expect(res.body.ok).toBe(1);
        done();
            });
      });


}); // describe
