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
