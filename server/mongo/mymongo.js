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
             );
             db.indexInformation(
               this.collection,
               {"full":true},
               (err,idx)=> {
                  if(err) throw err;
                  console.log("Existing index : \n",idx);
                  db.close();
                }
              )
          }
      );
    }

  //----------------------------------------------------------------------------
  // Execution d'un call back sur la database db.
  //        Le callBack prend un objet db en parametre,
  //        et doit se terminer par l'appel de db.close().
  //----------------------------------------------------------------------------
  command(dbCommandFunction)  {
      console.log("Connecting to "+ this.url);
      this.mc.connect(this.url)
        .then(dbCommandFunction)
        .catch((err)=>{console.log("Cannot connect to ",this.url); throw err;});
  }

  //----------------------------------------------------------------------------
  status(cb) { // callBack will be called with (stats) or null if error
    console.log("Checking MyMongo status");
    // Use connect method to connect to the Server
    this.command((db) => {
        console.log("Connected correctly to server");
        db.stats()
          .then((stats)=>{
            console.log(stats);
            cb(stats);
            db.close(); // Closing only if we are sure everything is finished ...
            console.log("Connection was closed");
            })
          .catch((err) => {throw err;});
        });
  }

  //----------------------------------------------------------------------------
  findAll(cb) { // callback will be called with  an array of docs or [] if error
    console.log("Retrieving all records");
    this.command( (db) => {
            console.log("Correctly connected to server");
            var col = db.collection(this.collection);
            col.find({},{_id:0}).toArray(
              (err,docs)=>{
                  if(docs) {
                      cb(docs);
                      } else {
                      cb([]);
                    };
                  })
          });
  }
  //----------------------------------------------------------------------------
  update(doc, cb) { // Update or create the doc in the collection,
                    // and call the callBack with the result
      console.log("Updating : ", doc);
      if(!doc || !doc.email || !doc.kg) {
        console.log("Cannot update empty doc :", doc);
        cb({"error":1, "doc":doc});
        return;
      }
      // On normalize la date, pour eviter de créer un record avec une string !
      doc.quand = normalizeDate(doc.quand);

      this.command((db)=> {
          console.log("Correctly connected to server");
          var col = db.collection(this.collection);
          col.updateOne(
                {'email':doc.email, 'quand':doc.quand}, {$set:{'kg':doc.kg}},
                {'upsert':true})
          .then((r)=>{console.log("Update result : ",r);cb(r);})
          .catch((err) => {throw err});
      });

  }

  //----------------------------------------------------------------------------
  zapCol() {   // Delete the collection
    console.log("Zapping the database ...");
    this.command((db)=>{db.dropCollection(this.collection)});
  }
}

//============================================================================
//  Helper functions
//============================================================================

function normalizeDate(date) {   // date can be a string, null or a Date object
  var r;
  if(!date) { r = new Date()} else {r=new Date(date)};
  r.setUTCHours(0,0,0,0);
  console.log("Date was normalized to :", r);
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
