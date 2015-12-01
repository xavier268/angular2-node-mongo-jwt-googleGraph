"uses strict";
//==============================================================================
//                    Basic jasmine test
//==============================================================================



describe("mymongo.js testing suite", function() {

  var mm;
  var o1 = {"quand":"2015-11-04","kg":85.2,"email":"testmail"};
  var o2 = {"quand":"2015-11-04","kg":90,"email":"testmail"};
  var o3 = {"quand":"2015-11-05","kg":85.2,"email":"testmail"};


  beforeAll(function(){
      mm = require("../server/mongo/mymongo").mymongo();
      expect(mm).toBeDefined();
      expect(mm).toBeTruthy();
      /*var end = (new Date()).getTime() + 5000; // wait 1 sec
      while((new Date()).getTime() < end) {
        1+2;
      }*/
  });

  //==========================================
  it("Basic connection command",()=>{
      mm.command((db)=>{
        expect(db).toBeDefined();
        db.close();})
  });

  //===========================================
  xit("Print status",()=>{
      mm.status((s)=>{console.log("Status : ",s);});
      expect(1).toBe(1);
  });


  //===========================================
  xit("Insert an object",()=>{
    mm.update(o1);
  });




});
