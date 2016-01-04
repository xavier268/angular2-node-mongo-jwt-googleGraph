#! /bin/bash

echo "==== Resetting database and importing poids.csv in mongodb/sldb/poids ======="
echo "Erasing ..."
mongo sldb --eval 'db.dropDatabase();'
echo "Importing ..."
cat tests/poids.csv | mongoimport -f email,quand,kg -d sldb -c poids --type=csv
echo "Converting date strings to ISODate types";
mongo sldb --eval 'db.poids.find().forEach(function(el){el.quand = new Date((new Date(el.quand)).setHours(12,0,0,0));db.poids.save(el);})'
echo "==== Done ====="
