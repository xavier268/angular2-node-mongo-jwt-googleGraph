#!/bin/bash
echo "---------------Versions--------------------"
echo "Bower version : $(bower --version)"
echo "mocha version : $(mocha --version)"
echo "npm version : $(npm --version)"
echo "node version : $(node --version)"
echo  $(mongo --version)
echo "---------------Install---------------------"
bower install
npm install

echo "---------------Test------------------------"
npm test
echo "---------------Running---------------------"
echo ""
npm start
