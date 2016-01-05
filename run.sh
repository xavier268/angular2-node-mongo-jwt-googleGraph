#!/bin/bash
echo "---------------Install---------------------"
npm install
node_modules/.bin/bower install
echo "---------------Versions--------------------"
echo "Bower version : $(node_modules/.bin/bower --version)"
echo "mocha version : $(node_modules/.bin/mocha --version)"
echo "npm version : $(npm --version)"
echo "node version : $(node --version)"
echo  $(mongo --version)
echo  $(mongoimport --version)
echo "Globally installed npm modules : "
echo $(npm ls -g --depth=0)
echo "---------------Test------------------------"
npm test
echo "---------------Running---------------------"
echo ""
npm start
