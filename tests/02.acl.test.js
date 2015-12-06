"use strict";
// jshint mocha:true

/*============================================================================
    Testing acl.js

Note that, using 'supertest', we do not need to launch directly a fully
configured server. Configuring an app is enough to test using volatile ports.

=============================================================================*/


describe("Full test for acl.js in a test server",function(){

  var expect = require("expect");
  // NB : ne pas confondre avec les fonctions expect fournies par supertetest

  var express = require("express");
  var supertest = require("supertest");
  var app = express();
  var acl = require("../server/acl");

  var testCredentials = {"user":"test","password":"passwd"};


  var jwt; // last java-web-token read ...


//===================================
  before(function(){ // before all ...
    console.log("Running test server");

    expect(acl).toBeTruthy();
    expect(app).toBeTruthy();
    expect(acl.aclrouter).toBeTruthy();


    app.use("/ttt",acl.aclrouter());
    app.use("/protected", acl.aclauth());
    app.all("/protected", function(req,res){res.send("OK1");});
    app.all("/",          function(req,res){res.send("OK2");});

    });


  //=======================================
  it("test server working",function(done){
      supertest(app)
        .get("/")
        .expect(200)
        .end(function(err,res){
              //console.log("Supertest gave : err=",err," res=",res);
              if(err) throw err;
              expect(res.text).toBe("OK2");
              done();
            });
  });

  //=======================================
  it("request a webtoken",function(done){
      supertest(app)
        .post("/ttt")
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

  //==========================================
  it("protected access should fail with no header",function(done){
      supertest(app)
          .post("/protected")
          .expect(401)
          .end(function(err,res){
            if(err) throw err;
            //console.log("Protected POST answer : ",res.text);

            supertest(app)
                .get("/protected")
                .expect(401)
                .end(function(err,res){
                  if(err) throw err;
                  //console.log("Protected GET answer : ",res.text);
                  done();
                });
          });
  });

  //=================================================================
  it("protected access should succeed with correct header",function(done){
      supertest(app)
          .get("/protected")
          .set("Authorization",jwt)
          .expect(200)
          .end(function(err,res){
            if(err) throw err;
            //console.log("Success GET answer : ",res.text);
            expect(res.text).toBe("OK1");
            done();
                });
          });


//=================================================================
    it("protected access should fail with wrong header",function(done){
        supertest(app)
            .get("/protected")
            .set("Authorization",jwt + "xxxx")
            .expect(401)
            .end(function(err,res){
              if(err) throw err;
              //console.log("Failed GET answer : ",res.text);
              done();
                  });
            });







});  // describe ======================================================
