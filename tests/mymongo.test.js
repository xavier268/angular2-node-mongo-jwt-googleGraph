"uses strict";
//==============================================================================
//                    Basic jasmine test
//==============================================================================
var expect = require("expect");


describe("mymongo.js testing suite", function() {

  var mm = require("../server/mongo/mymongo").mymongo();
  var o1 = {"quand":"2015-11-04","kg":85.2,"email":"testmail"};
  var o2 = {"quand":"2015-11-04","kg":90,"email":"testmail"};
  var o3 = {"quand":"2015-11-05","kg":85.2,"email":"testmail"};


  //==========================================
  xit("Basic connection command",()=>{
      mm.command((db)=>{
        expect(db).toBeTruthy();
        db.close();})
  });

  //===========================================
  xit("Print status",()=>{
      mm.status((s)=>{
          expect(s).toBeTruthy();
          //console.log("Status returned to test call : ",s);
          expect(s.ok).toBe(1);
          });
  });


  //===========================================
  xit("Get indexes",()=>{
    mm.getIndexes((idx)=>{
      expect(idx).toBeTruthy();
      //console.log("Indexes : ",idx);
      expect(idx.length).toBe(2);
      });
  });

  //===========================================
  it("update data",function(){  // Nesteing is required to garantee execution order ...
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
