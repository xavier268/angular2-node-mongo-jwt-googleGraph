  "use strict";
  // jshint mocha:true

//==============================================================================
//                    Basic moch test for mymongo.js
//==============================================================================
var expect = require ( "expect" );

describe("mymongo interface v2 testing", function () {

  var mm = require ("../server/mongo/mymongo").mymongo ();
  mm.collection = "testCollection";
  console.log("Switching to the test collection : ", mm.collection);
    //mm.url = "mongodb://localhost:8888/wrongurl";console.log("Switching to the test url : ",mm.url);

  //==================================
  xit("ngcommand empty async",function(done){
        mm.ngCommand(  (err,db)=>{
        console.log("ngCommand called with err : ",err, " and db : ",db);
        if(!err) {db.close();}
        done();
      });
      });


  //==================================
  it("ngcommand empty promise",function(done){
    mm.ngCommand()
    .then((db)=> {console.log("db promise = ",db);db.close();done();})
    .catch((e)=>{console.log("error promise = ",e);done();});
  });

  //====================================
  it("ngstatus in async mode",function(done){
    mm.ngStatus((err,stat)=>{
      if(err) {
        console.log("Err in test ng status :", err);
        done();
      }else {
        console.log("Stats in test : ",stat);
        done();
      }
    });
  });

  //====================================
  xit("ngstatus in promise mode",function(done){
    mm.ngStatus()
    .then((s)=>{console.log("Status returned :",s);done();})
    .catch((e)=>{console.log("Error in ngstatus test promise : ",e);});
        // Beacuse done() is not in catch, will fail test on error ...

  });

  //========================================
  xit("ngGetIndexes test in promise mode",function(done){
    mm.ngGetIndexes()
      .then((i)=>{console.log("Indexes in test : ",i);done();})
      .catch((e)=>{console.log("Erreur in ngGetIndexes test : ",e);});
  });

  //==========================================
  it("ngGetIndexes test in async mode",function(done){
    mm.ngGetIndexes( (e,i)=>{
      if(e) {
        console.log("Erreur test ngGetIndexes async",e);
        throw e;
      }else {
        console.log("Indexes in test : ",i);
        done();
      }
    }

    );
  });


}); // describe ==============================================================

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

  //==============================================
  it("Get all test records (empty or one)",function(done){
    mm.findAll((r)=>{
      expect(r.length).toBeLessThan(2);
      //console.log("Test result1 :\n",r);
      done();
    });
  });

  //==========================================
  it("Basic connection command",(done)=>{
      mm.command((db)=>{
        expect(db).toBeTruthy();
        db.close();
        done();
        },true);//keepOpen
});

  //===========================================
  it("Print status",(done)=>{
      mm.status((s)=>{
          expect(s).toBeTruthy();
          //console.log("Status returned to test call : ",s);
          expect(s.ok).toBe(1);
          done();
          });
  });


    //===========================================
    it("Get indexes",(done)=>{
      mm.getIndexes((idx)=>{
        expect(idx).toBeTruthy();
        //console.log("Indexes : ",idx);
        expect(idx.length).toBe(2);
        done();
        });
    });



    //===========================================
    // Zapping at the end, so that indexes have bee, correctly tested above ..

      it("Zap then update then zap",function(done){
        mm.zapCol();
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

                  // Zapping
                  mm.zapCol();
                  done();
                  });
              });
      });

      });




});
