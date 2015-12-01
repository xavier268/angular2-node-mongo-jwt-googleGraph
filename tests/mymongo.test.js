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




});
