"uses strict";
//==============================================================================
//                    Basic moch test for mymongo.js
//==============================================================================
var expect = require("expect");


describe("mymongo.js testing suite", function() {

  var mm = require("../server/mongo/mymongo").mymongo();
      mm.collection = "testCollection";
      console.log("Switching to the test collection : ",mm.collection);
  var o1 = {"quand":"2015-11-04","kg":85.2,"email":"testmail"};
  var o2 = {"quand":"2015-11-04","kg":90,"email":"testmail"};


  //==========================================
  it("General parameters",function(){
    expect(mm).toBeTruthy();
    expect(mm.collection).toBe("testCollection");

  });

  //==========================================
  it("Basic connection command",()=>{
      mm.command((db)=>{
        expect(db).toBeTruthy();
        db.close();})
  });

  //===========================================
  it("Print status",()=>{
      mm.status((s)=>{
          expect(s).toBeTruthy();
          //console.log("Status returned to test call : ",s);
          expect(s.ok).toBe(1);
          });
  });


  //===========================================
  it("Get indexes",()=>{
    mm.getIndexes((idx)=>{
      expect(idx).toBeTruthy();
      //console.log("Indexes : ",idx);
      expect(idx.length).toBe(2);
      });
  });

  //===========================================
  describe("Zap & Update data",function(){

    it("Zap",function(){mm.zapCol();});


    it("Update",function(){ // Nesting is required to garantee execution order ...
    mm.update(o1,(r)=>{
      //console.log("Update result : ",r);
      expect(r.result.ok).toBe(1);

      mm.update(o2,(r)=>{
          //console.log("Update result : ",r);
          expect(r.result.ok).toBe(1);
          expect(r.result.nModified).toBe(1);
          expect(r.result.n).toBe(1);

          mm.update(o2,(r)=>{
              //console.log("Update result : ",r);
              expect(r.result.ok).toBe(1);
              expect(r.result.nModified).toBe(0);
              expect(r.result.n).toBe(1);
              });
          });
      });
    });


  });
  //===========================================
  xdescribe("Update & Zap data - NOT WORKING - SYNCHRO CONFLICT ?!",function(){

    it("Update",function(){ // Nesting is required to garantee execution order ...
    mm.update(o1,(r)=>{
      //console.log("Update result : ",r);
      expect(r.result.ok).toBe(1);

      mm.update(o2,(r)=>{
          //console.log("Update result : ",r);
          expect(r.result.ok).toBe(1);
          expect(r.result.nModified).toBe(1);
          expect(r.result.n).toBe(1);

          mm.update(o2,(r)=>{
              //console.log("Update result : ",r);
              expect(r.result.ok).toBe(1);
              expect(r.result.nModified).toBe(0);
              expect(r.result.n).toBe(1);
              });
          });
      });
    });

    it("Zap",function(){mm.zapCol();});

  });

  //==============================================
  it("Get all records",function(){
    mm.findAll((r)=>{
      //console.log("Test result : \n",r);
      expect(r.length).toBe(1);
      expect(r[0].email).toBeTruthy();
      expect(r[0].kg).toBeTruthy();
      expect(r[0].quand).toBeTruthy();
    });
  });

  //============================================
  it("Zap database",function(){

    });


});
