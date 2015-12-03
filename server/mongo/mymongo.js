"use strict";

//==============================================================================
//                Mongodb access layer
//==============================================================================

class MyMongo {

  constructor() {
    console.log("Constructing MyMongo");
    this.mc = require('mongodb').MongoClient;
    this.url = require("./mymongo.conf").url;
    this.collection=require("./mymongo.conf").collection;
    console.log("Database url : ", this.url);
    console.log("Database Collection : ",this.collection);

    console.log("Verification/indexation de la base");
    this.command(
          (db)=> {
             db.createIndex(
               this.collection,
               {"email":1,"quand":1},
               {"unique":true,"name":"UniqueEmailDateIndex"}
             )
             .then((r)=>{console.log("Index creation : ",r);db.close();})
             .catch((e)=>{console.log("Error creating default indexes : ",err);db.close();throw err});
              }
          ,true)// keepOpen
    }

  //----------------------------------------------------------------------------
  // Execution d'un call back sur la database db.
  //        Le callBack prend un objet db en parametre,
  //        Si keepOpen (default = false) est truthy, on ne ferme pas la DB.
  //        C'est necessaire si on fait des actions asynchrones ensuite.
  //        Si keepOpen est undefined ou falsy, la db est fermée juste après le callBack
  //----------------------------------------------------------------------------
  command(dbCommandFunction, keepOpen)  {
      this.mc.connect(this.url)
        .then((db)=>{dbCommandFunction(db);if(keepOpen){return;} db.close();})
        .catch((err)=>{console.log("Command cannot connect to ",this.url, "\n",err); throw err;});
  }

  ngCommand(next){  // next(err,result) sinon, renvoi une promise de result
      if(next) {
        this.mc.connect(this.url,next);
      } else {
        var _this=this; // Lorsque la promise sera apellée, this sera undefined !
        return new Promise( function(resolve,reject) {
          _this.mc.connect(_this.url)
          .then((r)=>{resolve(r)})
          .catch((e)=>{reject(e)});
          })
          };
        };
      

  //----------------------------------------------------------------------------
  status(cb) { // callBack will be called with (stats) or null if error
    this.command((db) => {
        db.stats((err,st)=>{
              if(err) {console.log("error status call",err);};
              cb(st);
              db.close();
              });
      },true); // KeepOpen
  }

  ngStatus(next){ // next(err,result) sinon, renvoi une promise de result
    if(next) {
      this.ngCommand()
      .then((db)=>{
          db.stats()
            .then((st)=>{next(null,st);db.close();})
          })
      .catch((err)=>{console.log("Error in ngstatus :",err);next(err,null)})
    }else {
      var _this=this;
      return new Promise(function(resolve,reject){
        return _this.ngStatus((err,result)=>{if(err){reject(err);throw err;}else{resolve(result);}})
      })
    }
  }


  //----------------------------------------------------------------------------
  getIndexes(cb) { //callback will be called with index array
    this.command((db) => {
        db.indexInformation(this.collection,{"full":true})
          .then((idx)=>{
            cb(idx);
            db.close();
            })
          .catch((err) => {console.log("error in getIndexes call",err);db.close();});
        },true);// keepOpen
  }

  //----------------------------------------------------------------------------
  findAll(cb) { // callback will be called with  an array of docs or [] if error
    //console.log("Retrieving all records");
    this.command( (db) => {
            var col = db.collection(this.collection);
            col.find({},{_id:0}).toArray(
              (err,docs)=>{
                  if(!err) {
                      cb(docs);
                      db.close();
                      } else {
                      console.log("Error in findAll : ",err);
                      db.close();
                      cb([]);
                    };
                  })
          },true);  //keepOpen
  }
  //----------------------------------------------------------------------------
  update(doc, cb) { // Update or create the doc in the collection,
                    // and call the callBack with the result
      //console.log("Updating : ", doc);
      if(!doc || !doc.email || !doc.kg) {
        console.log("Cannot update empty doc :", doc);
        cb({"error":1, "doc":doc});
        return;
      }
      // On normalize la date, pour eviter de créer un record avec une string !
      doc.quand = normalizeDate(doc.quand);

      this.command((db)=> {
          var col = db.collection(this.collection);
          col.updateOne(
                {'email':doc.email, 'quand':doc.quand}, {$set:{'kg':doc.kg}},
                {'upsert':true})
          .then((r)=>{cb(r);db.close()})
          .catch((err) => {console.log("Error in update",err);db.close();});
      },true);//keepOpen
  }

  //----------------------------------------------------------------------------
  zapCol() {   // Delete the collection
    //console.log("Zapping the collection : " + this.url +"/" +this.collection);
    this.command((db)=>{
      db.dropCollection(this.collection)
          .then((r)=>{db.close();})
          .catch((e)=>{console.log("Error zapping collection : ",e);db.close();})}
          ,true // keepOpen
        );
  }
}

//============================================================================
//  Helper functions
//============================================================================

function normalizeDate(date) {   // date can be a string, null or a Date object
  var r;
  if(!date) { r = new Date()} else {r=new Date(date)};
  r.setUTCHours(0,0,0,0);
  //console.log("Date was normalized to :", r);
  return r;
}

//==============================================================================
// Instanciate a single, static, singleton instance
//==============================================================================
console.log("Creating the singleton MyMongo instance");
MyMongo.instance = new MyMongo;

//==============================================================================
// Define exports
//==============================================================================

exports.mymongo = function() {
  console.log("Accessing the MyMongo singleton instance");
  return MyMongo.instance;
}
