#! /bin/bash

echo "==== Resetting database and importing poids.csv in mongodb/sldb/poids ======="
echo "Erasing existing database ..."
mongo sldb --eval 'db.dropDatabase();'
echo "Importing test data ..."
cat tests/poids.csv | mongoimport -f email,quand,kg -d sldb -c poids --type=csv
echo "Converting date strings to ISODate types, normalizing to 12:00 UTC"
mongo sldb --eval 'db.poids.find().forEach(function(el){el.quand = new Date(new Date((new Date(el.quand)).setHours(12,0,0,0)).setUTCHours(12));db.poids.save(el);})'
echo "Creating a unique index email/quand"
mongo sldb --eval 'db.poids.createIndex({"email":1,"quand":1},{"unique":true});'
echo "listing existing indexes"
mongo sldb --eval 'db.poids.getIndexes().forEach(printjson);'
echo "==== Done ====="
