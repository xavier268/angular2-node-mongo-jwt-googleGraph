"use strict";
// jshint mocha:true

//================================================
// Scrap book for promises
//================================================


function PA() {

    return new Promise(function (resolve, reject) {
        resolve("ARESULT");
    });
}



<<<<<<< HEAD
describe("Promise tests", function(){
=======
xdescribe("Promise tests", function () {
>>>>>>> dev

    it("Test1", function () {

        PA()
            .then((r)=>{console.log("Ret1 : ",r); return r + "xx";})
            .then((r)=>{console.log("Ret2 : ",r);})
            .then((r)=>{console.log("Ret3 : ",r);})
            .then((r)=>{console.log("Ret4 : ",r);})
            .then((r)=>{console.log("Ret5 : ",r);})
            .catch((err)=>{console.log("Err : ",err);})
            ;


  });


});
