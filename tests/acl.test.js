"use strict";
// jshint mocha:true

/*============================================================================
    Test de acl.js

En utilisant supertest, pas besoin de lancer réellement le serveur sur un port
donné ! Il suffit de parametrer app avec les middleware et les appels sont
simulés !!

=============================================================================*/


describe("Full test for acl.js in a test server",function(){

  var expect = require("expect");
  // NB : ne pas confondre avec les fonctions expect fournies par supertetest

  var express = require("express");
  var supertest = require("supertest");
  var app = express();
  var acl = require("../server/acl");
  var bodyParser = require("body-parser");

  var server;


//===================================
  before(function(){
    console.log("Running test server");

    expect(acl).toBeTruthy();
    expect(app).toBeTruthy();
    expect(acl.aclrouter).toBeTruthy();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use("/ttt",acl.aclrouter());
    app.use("/protected", acl.aclauth());
    app.get("/protected",function(req,res){res.send("OK2");});


    app.all("/",function(req,res){res.send("OK1");});

    //server = app.listen(8888);
    //done();

    });

    //====================================
    /*
    after(function(){

      console.log("Closing server");
      server.close();

    });
    */

  //=======================================
  it("test server working",function(done){
      supertest(app)
        .get("/")
        .expect(200)
        .end(function(err,res){
              //console.log("Supertest gave : err=",err," res=",res);
              if(err) throw err;
              expect(res.text).toBe("OK1");
              done();
            });
  });

  //=======================================
  it("request a webtoken",function(done){
      supertest(app)
        .post("/ttt")
        .set("Content-Type","application/json")
        .send({"user":"xavier","password":"blandine"})
        //.expect(200)
        .end(function(err,res){
            if(err) throw err;
            console.log("Token returned :",res.text);
            done();

        });

  });

  //==========================================
  it("protected access",function(done){
      supertest(app)
          .post("/protected")
          .expect(401)
          .end(function(err,res){
            if(err) throw err;
            console.log("Protected POST answer : ",res.text);

            supertest(app)
                .get("/protected")
                .expect(401)
                .end(function(err,res){
                  if(err) throw err;
                  console.log("Proteced GET answer : ",res.text);

                  done();
                });
          });
  });





});  // describe ======================================================
