"use strict";

//==============================================================================
//                Mongodb access layer
//==============================================================================


class MyMongo {

  constructor() {
    console.log("Constructing MyMongo layer");
    this.mc = require('mongodb').MongoClient;
    this.url = 'mongodb://localhost:27017/sldb';
    this.collection="poids";
    }

  //============================================================================
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

  //============================================================================
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
  //============================================================================
  update(doc, cb) { // Update or create the doc in the collection,
                    // and call the callBack with the result
      console.log("Updating : ", doc);
      if(!doc || !doc.email || !doc.quand || !doc.kg) {
        console.log("Cannot update empty doc :", doc);
        cb({"error":1, "doc":doc});
        return;
      }
      // On normalize la date, pour eviter de créer un record avec une string !
      doc.quand = new Date(doc.quand);
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

  //============================================================================
  zapCol() {   // Delete the collection
    console.log("Zapping the database ...");
    this.mc
    .connect(this.url)
    .then((db)=>{db.dropCollection(this.collection)});
  }

}

// Static singleton instance
MyMongo.instance = new MyMongo;

//==============================================================================
// Define exports
//==============================================================================

exports.mymongo = function() {
  console.log("Exporting the MyMongo singleton instance");
  return MyMongo.instance;
}
