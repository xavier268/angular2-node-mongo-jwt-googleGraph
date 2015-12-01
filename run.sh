#!/bin/bash
echo "---------------Versions--------------------"
echo "Bower version : $(bower --version)"
echo "jasmine version : $(jasmine -v)"
echo "npm version : $(npm --version)"
echo "node version : $(node --version)"
echo "---------------Install---------------------"
bower install
npm install

echo "---------------Test------------------------"
npm test
echo "---------------Running---------------------"
echo ""
npm start
