  "use strict";

// jshint mocha:true
describe("Full test set for myMongo.js",function(){

//==============================================================================
//                    Basic moch test for mymongo.js
//==============================================================================
var expect = require ( "expect" );

describe("mymongo class testing", function () {

  var o1 = {"quand":"2015-11-04","kg":85.2,"email":"testmailv2"};


  var mm = require ("../server/mongo/mymongo").mymongo ();
  mm.collection = "testCollection";
  console.log("Switching to the test collection : ", mm.collection);
  //mm.url = "mongodb://localhost:8888/wrongurl";console.log("Switching to the test url : ",mm.url);

  //==================================
  it("ngcommand empty async",function(done){
        mm.ngCommand(  (err,db)=>{
        //console.log("ngCommand called with err : ",err, " and db : ",db);
        if(!err) {db.close();}
        done();
      });
      });


  //==================================
  it("ngcommand empty promise",function(done){
    mm.ngCommand()
    .then((db)=> {
        //console.log("db promise = ",db);
        db.close();
        done();
        })
    .catch((e)=>{console.log("error promise = ",e);done();});
  });

  //====================================
  it("ngstatus in async mode",function(done){
    mm.ngStatus((err,stat)=>{
      if(err) {
        console.log("Err in test ng status :", err);
        done();
      }else {
        //console.log("Stats in test : ",stat);
        expect(stat.ok).toBe(1);
        done();
      }
    });
  });

  //====================================
  it("ngstatus in promise mode",function(done){
    mm.ngStatus()
    .then((s)=>{
        //console.log("Status returned :",s);
        expect(s.ok).toBe(1);
        done();
        })
    .catch((e)=>{console.log("Error in ngstatus test promise : ",e);});
        // Beacuse done() is not in catch, will fail test on error ...

  });

  //========================================
  it("ngGetIndexes test in promise mode",function(done){
    mm.ngGetIndexes()
      .then((i)=>{
            //console.log("Indexes in test : ",i);
            expect(i).toBeTruthy();
            expect(i).toBeAn(Array);
            expect(i.length).toBeGreaterThan(1);
            done();})
      .catch((e)=>{console.log("Erreur in ngGetIndexes test : ",e);});
  });

  //==========================================
  it("ngGetIndexes test in async mode",function(done){
    mm.ngGetIndexes( (e,i)=>{
      if(e) {
        console.log("Erreur test ngGetIndexes async",e);
        throw e;
      }else {
        //console.log("Indexes in test : ",i);
        expect(i).toBeTruthy();
        expect(i).toBeAn(Array);
        expect(i.length).toBeGreaterThan(1);
        done();
      }
    }

    );
  });


  //================================================
  it("ngFindAll in promise mode",function(done){
    mm.ngFindAll()
      .then((docs)=>{
          //console.log("ngFindAll testing : ",docs);
          expect(docs).toBeTruthy();
          expect(docs).toBeAn(Array);
          expect(docs.length).toBeLessThan(2);
          done();
          })
      .catch((e)=>{console.log("Erreur in test of ngFindAll ",e);});
  });

  //================================================
  it("ngUpdate in promise mode",function(done){
    mm.ngUpdate(o1)
      .then((r)=>{
          //console.log("Updated in test ngUpdate : ",r);
          expect(r.result.ok).toBe(1);
          expect(r.result.n).toBe(1);
          done();
          })
      .catch((e)=>{console.log("Error in test of ngUpdate",e);});

  });

//=================================================
  it("ngZapCol test and ngUpdate",function(done){
    mm.ngZapCol()
      .then((z)=>{
            //console.log("Result zap col : ",r);
            expect(z).toBe(true);
            mm.ngUpdate(o1)
              .then((r)=>{
                  //console.log("Updated in test ngUpdate : ",r);
                  expect(r.result.ok).toBe(1);
                  expect(r.matchedCount).toBe(1);
                  expect(r.modifiedCount).toBe(0);
                  expect(r.upsertedCount).toBe(1);
                  expect(r.result.n).toBe(1);
                  done();
                  })
              .catch((e)=>{console.log("Error in test ngUpdate (afetr zap) ",e);});
            })
      .catch((e)=>{console.log("Error in test ngZapCol & update :",e);});

  });

}); // describe class myMongo ===========


//=====================================================
describe("Testing helper function",function(){
//=====================================================

  it("testing normalize for date",function(){
    var nn = require ("../server/mongo/mymongo").normalizeDate;
      //console.log(nn().toUTCString());
    expect(nn().getHours()).toBe(12);
    expect(nn().getMinutes()).toBe(0);
    expect(nn().getSeconds()).toBe(0);
    expect(nn().getDate()).toBe((new Date()).getUTCDate());

    expect(nn("2010-05-01").getMinutes()).toBe(0);
    expect(nn("2010-5-1").getDate()).toBe(1);
    expect(nn("2010-5-10").getDate()).toBe(10);
    expect(nn("2010-05-01T11:11:11").getMinutes()).toBe(0);
  });


}); // describe helper functions ============



}); // describe  file ==========
