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
echo  $(java -version)
echo "Globally installed npm modules : "
echo $(npm ls -g --depth=0)
echo "---------------Testing---------------------"
echo "Creating test database and importing test data"
tests/import.sh
echo "---------------Running---------------------"
echo ""
echo "****************************************************************"
echo "*  Connect your browser on port 8080 (http) or 4443 (https)    *"
echo "*            Press Ctrl^C to stop the server                   *"
echo "****************************************************************"
npm start
