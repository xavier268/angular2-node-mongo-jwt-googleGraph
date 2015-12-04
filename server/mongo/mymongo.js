"use strict";


/*==============================================================================
                          Mongodb access layer

Les methodes prennent un callBack optionn next(err,result)
Si le call back n'est pas fourni, les methodes renvoient une Promise du resultat
=============================================================================*/

class MyMongo {

  constructor() {
    console.log("Constructing MyMongo");
    this.mc = require('mongodb').MongoClient;
    this.url = require("./mymongo.conf").url;
    this.collection=require("./mymongo.conf").collection;
    console.log("Database url : ", this.url);
    console.log("Database Collection : ",this.collection);

    console.log("Verification/indexation de la base");
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
      .catch((e)=>{console.log("Error in constructing MyMong class",e);throw e;});
    }

  /*----------------------------------------------------------------------------
      Se connecte à la database, renvoie un objet db.
      Le client de cette méthode doit appeller db.close() dès que possible.
  ---------------------------------------------------------------------------*/
  ngCommand(next){  // next(err,result) sinon, renvoi une promise de result
      if(next) {
        this.mc.connect(this.url,next);
      } else {
        var _this=this; // Lorsque la promise sera apellée, this sera undefined !
        return new Promise( function(resolve,reject) {
          _this.mc.connect(_this.url)
          .then((r)=>{resolve(r);})
          .catch((e)=>{reject(e);});
        });
          }
        }


  /*----------------------------------------------------------------------------
      Infos de statut détaillées de la database
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
     Infos sur les indexes de la collection
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
    Renvoie un tableau de tous les docs de la collection, triés.
  ----------------------------------------------------------------------------*/
  ngFindAll(next) {
    if(next) {
      this.ngCommand()
        .then((db)=>{
            db.collection(this.collection)
              .find({},{_id:0})
              .toArray((err,docs)=>{
                  if(!err){
                    db.close();
                    next(null,docs);
                  }else{
                    console.log("Erreur in ngFindAll ",err);
                    db.close();
                    next(err,null);
                  }
              });
            })
        .catch((err)=>{console.log("Error in ngFindAll",err);next(err,null);});

    }else{
      var _this=this;
      return new Promise(function(resolve,reject){
        return _this.ngFindAll((err,result)=>{if(err){reject(err);}else{resolve(result);}});
      });
    }

  }
  /*----------------------------------------------------------------------------
        Met à jour ou crée un nouveau document.
        Les dates sont normalisées à 0h0:00:00 heure locale.
  -----------------------------------------------------------------------------*/
    ngUpdate(doc,next) {
    // Erreur si doc non conforme
    if(!doc || !doc.email || !doc.kg) {
      console.log("Cannot update empty doc :", doc);
      if(next)  {next(new Error(doc),null);return;}
      else      {return new Promise(function(resolve,reject){reject(doc);});}
    }
    // On normalize la date, pour eviter de créer un record avec une string !
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
        Detruit la collection
  ----------------------------------------------------------------------------*/
  ngZapCol(next) {
    if(next) {
      this.ngCommand()
          .then((db)=>{
              db.dropCollection(this.collection)
                .then((r)=>{db.close();next(null,r);});
          })
          .catch((err)=>{console.log("Error in ngUpdate ",err); next(err,null);});
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
                  Normalize la date

      Accepte null, une Date ou une string (representant une date LOCALE)
      Normalise à 12h0:00:00 LOCALES (pour eviter pb de changt de jour)
      Garantit de renvoyer un OBJET DATE non null
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
