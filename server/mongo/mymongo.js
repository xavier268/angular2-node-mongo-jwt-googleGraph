"use strict";


/*==============================================================================
                          Mongodb access layer

Methodes are accepting next(err,result) as an optionnel last argument callback.
If callBack is not provided, methodes are returning a Promise.

All setup parameters are defined in the mymongo.conf configuration file.
=============================================================================*/

class MyMongo {

  constructor() {
    console.log("Constructing MyMongo");
    this.mc = require('mongodb').MongoClient;
    this.url = require("./mymongo.conf").url;
    this.collection=require("./mymongo.conf").collection;
    console.log("Database url : ", this.url);
    console.log("Database Collection : ",this.collection);

    console.log("Database verification/indexation");
    this.ngCommand()
      .then((db)=> {
             db.createIndex(
               this.collection,
               {"email":1,"quand":1},
               {"unique":true,"name":"UniqueEmailDateIndex"}
             )
             .then((r)=>{db.close();})
             .catch((e)=>{console.log("Error creating default indexes : ",e);db.close();throw e;});
           })
      .catch((e)=>{console.log("Error in constructing MyMongo class",e);throw e;});
    }

  /*----------------------------------------------------------------------------
      Connects to the Databse, providing the db object.
      You should ensure that db.close() is calles a soon as possible afterwards.
  ---------------------------------------------------------------------------*/
  ngCommand(next){  // next(err,result) otherwise a Promise will be sent
      if(next) {
        this.mc.connect(this.url,next);
      } else {
        // When the Promise will be resolved,
        // the original this won't be available anymore !
        var _this=this;
        return new Promise( function(resolve,reject) {
          _this.mc.connect(_this.url)
          .then((r)=>{resolve(r);})
          .catch((e)=>{reject(e);});
        });
          }
        }


  /*----------------------------------------------------------------------------
      Provides detailled stats about database
  -----------------------------------------------------------------------------*/
  ngStatus(next){
    if(next) {
      this.ngCommand()
      .then((db)=>{
          db.stats()
            .then((st)=>{db.close();next(null,st);});
          })
      .catch((err)=>{console.log("Error in ngstatus :",err);next(err,null);});
    }else {
      var _this=this;
      return new Promise(function(resolve,reject){
        return _this.ngStatus((err,result)=>{if(err){reject(err);}else{resolve(result);}});
      });
    }
  }


  /*----------------------------------------------------------------------------
     Provides all indexes from the collection
  ----------------------------------------------------------------------------*/
  ngGetIndexes(next) { // next(err, result) ou sinon, promise de result
    if(next) {
      this.ngCommand()
        .then((db)=>{db
            .indexInformation(this.collection,{"full":true})
            .then((idx)=>{db.close();next(null,idx);});
        })
        .catch((err)=>{console.log("Error in ngGetIndexes : ",err);next(err,null);});
    }else{
      var _this=this;
      return new Promise(function(resolve,reject){
        return _this.ngGetIndexes((err,result)=>{if(err){reject(err);}else{resolve(result);}});
      });
    }
  }



  /*----------------------------------------------------------------------------
     Provides a sorted array with all the documents from the collection.
     Limit results to the selected Mongo filter
  ----------------------------------------------------------------------------*/
  ngFindAllFilter(filter, next) {
    if(next) {
      this.ngCommand()
        .then((db)=>{
            db.collection(this.collection)
              .find(filter,{_id:0})
              .toArray((err,docs)=>{
                  if(!err){
                    db.close();
                    next(null,docs);
                  }else{
                    console.log("Erreur in ngFindAllFilter ",err);
                    db.close();
                    next(err,null);
                  }
              });
            })
        .catch((err)=>{console.log("Error in ngFindAll",err);next(err,null);});

    }else{
      var _this=this;
      return new Promise(function(resolve,reject){
        return _this.ngFindAllFilter(filter,(err,result)=>{if(err){reject(err);}else{resolve(result);}});
      });
    }

  }


  /*----------------------------------------------------------------------------
        Updates (or creates ) a document.
        Dates are normalized at 12:00:00 LOCAL TIME.
  -----------------------------------------------------------------------------*/
    ngUpdate(doc,next) {
    // Reject invalid docs
    if(!doc || !doc.email || !doc.kg) {
      console.log("Cannot update invalid doc :", doc);
      throw("Invalid doc format");
    }
    // Normalize date to ensure a normalized ISODate object is created/updated
    doc.quand = normalizeDate(doc.quand);

    if(next) {
      this.ngCommand()
        .then( (db)=>{
            db.collection(this.collection)
                .updateOne(
                      {'email':doc.email, 'quand':doc.quand},
                      {$set:{'kg':doc.kg}},
                      {'upsert':true}
                )
                .then((r)=>{ db.close();next(null,r);});
        })
        .catch((err)=>{console.log("Error in ngUpdate ",err); next(err,null);});
    }else {
      var _this=this;
      return new Promise(function(resolve,reject){
        return _this.ngUpdate(doc,(err,result)=>{if(err){reject(err);}else{resolve(result);}});
      });
    }
  }

  /*----------------------------------------------------------------------------
        Drop the collection
  ----------------------------------------------------------------------------*/
  ngZapCol(next) {
    if(next) {
      this.ngCommand()
          .then((db)=>{
              db.dropCollection(this.collection)
                .then((r)=>{db.close();next(null,r);});
          })
          .catch((err)=>{console.log("Error in ngZapCol ",err); next(err,null);});
    }else {
      var _this=this;
      return new Promise(function(resolve,reject){
        return _this.ngZapCol((err,result)=>{if(err){reject(err);}else{resolve(result);}});
      });
    }
  }

} // class

/*==============================================================================
                    Helper functions
==============================================================================*/
/*------------------------------------------------------------------------------
                  Normalize Dates

      Acceptes null, a Date or a string (representanting a LOCAL date)
      Normalized to 12h0:00:00 LOCAL (to avoid unexpected day change)
      Will always return a non null Date object
-------------------------------------------------------------------------------*/
function  normalizeDate(date) {
  var r;
  if(!date) { r = new Date();} else {r=new Date(date);}
  r.setHours(12,0,0,0);
  //console.log("Date was normalized to :", r);
  return r;
}

//==============================================================================
// Instanciate a single, static, singleton instance
//==============================================================================
console.log("Creating the singleton MyMongo instance");
MyMongo.instance = new MyMongo();

//==============================================================================
// Define exports
//==============================================================================

exports.mymongo = function() {
  console.log("Accessing the MyMongo singleton instance");
  return MyMongo.instance;
};

exports.normalizeDate = normalizeDate;
