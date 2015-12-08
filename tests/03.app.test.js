"use strict";
// jshint mocha:true

/*==============================================================================
                            Application testing
==============================================================================*/

describe("integration test of application",function(){

  var mm = require ("../server/mongo/mymongo").mymongo ();
  var expect = require ( "expect" );
  var defColl; // default collection outside test

    before(function(){
      defColl = mm.collection;
      mm.collection = "testCollection";
      console.log(">>>>> Switching to the test collection : ", mm.collection);
      //mm.url = "mongodb://localhost:8888/wrongurl";console.log("Switching to the test url : ",mm.url);
    });

    after(function(){
      console.log("<<<<< Switching back to default collection : ",defColl);
      mm.collection = defColl;
    });

var supertest = require("supertest");

var app = require("../server/myapp").app();
var jwt;    // Generated token

var testCredentials = {"user":"test","password":"passwd"};
var testRecord = {"email":"test@test.com","kg":222,"quand":"2011-12-13"};

it("jwt token generation", function(done){
  supertest(app)
  .post("/jwt")
  .set("Content-Type","application/json")
  .send(testCredentials)
  .expect(200)
  .end(function(err,res){
      if(err) throw err;
      //console.log("Token returned :",res.text);
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
        //console.log("No header answer : ",res.text);
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
        //console.log("No header answer : ",res.text);
        done();
            });
      });

  it("update a test record in test collection", function(done){
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

    it("update should fail with different user than loggedIn user", function(done){
      var testRecord2 = testRecord;
      testRecord2.email = "changedEmail";
      supertest(app)
          .post("/api/poids")
          .set("Authorization",jwt)
          .set("Accept","application/json")
          .send(testRecord2)
          .expect(401)
          .end(function(err,res){
            if(err) throw err;
            //console.log("Success POST answer : ",res.text);
            expect(res.body.error).toBeTruthy();
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
        //console.log("Success GET answer to get all records from db test : ",res.text);
        expect(res.body).toBeAn(Array);
        expect(res.body.length).toBe(1);
        expect(res.body[0].email).toBe("test@test.com");
        done();
            });
      });







}); // describe
