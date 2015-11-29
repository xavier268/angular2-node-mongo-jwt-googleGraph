"use strict";

//==============================================================================
//                Mongodb access layer
//==============================================================================


class MyMongo {

  constructor() {
    console.log("Constructing MyMongo");
    this.mc = require('mongodb').MongoClient;
    this.url = 'mongodb://localhost:27017/sldb';
    this.collection="poids";
    console.log("Database url : ", this.url);
    console.log("Database Collection : ",this.collection);

    console.log("Verification/indexation de la base");
    this.mc
      .connect(this.url)
      .then(
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
      )
      .catch((err)=>{console.log("Cannot connect to mongodb !"); throw err;});
    }

  //----------------------------------------------------------------------------
  status(cb) { // callBack will be called with (stats) or null if error
    console.log("Checking MyMongo status");
    // Use connect method to connect to the Server
    this.mc
      .connect(this.url)
      .then( (db) => {
        console.log("Connected correctly to server");
        db.stats()
          .then((stats)=>{
            console.log(stats);
            cb(stats);
            db.close(); // Closing only if we are sure everything is finished ...
            console.log("Connection was closed");
            })
          .catch((err) => {throw err;});
          })
      .catch((err) => {console.log(err);cb(null)}); // Return null if error
  }

  //----------------------------------------------------------------------------
  findAll(cb) { // callback will be called with  an array of docs or [] if error
    console.log("Retrieving all records");
    this.mc
      .connect(this.url)
      .then(
        (db) => {
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
          }
      )
      .catch((err) => {console.log(err);cb([])}); // Return null if error
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

      this.mc
      .connect(this.url)
      .then((db)=> {
          console.log("Correctly connected to server");
          var col = db.collection(this.collection);
          col.updateOne(
                {'email':doc.email, 'quand':doc.quand}, {$set:{'kg':doc.kg}},
                {'upsert':true})
          .then((r)=>{console.log("Update result : ",r);cb(r);})
          .catch((err) => {throw err});
      })
      .catch((err)=>{console.log("Erreur : ", err);cb(err)});

  }

  //----------------------------------------------------------------------------
  zapCol() {   // Delete the collection
    console.log("Zapping the database ...");
    this.mc
    .connect(this.url)
    .then((db)=>{db.dropCollection(this.collection)});
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
