# angular2-node-mongo-jwt-googleGraph

A full-fledged proof-of-concept application to test/demonstrate use and integration of the various technologies.

**WORK IN PROGRESS** : porting to Angular2rc5 with server-side compilation ...

## Application is demonstrating

* Node v6.3.1 with ES6 (server) and TypeScript(client)
* Angular2 client
* RESTFull API
* time-bounded access control using jwt,
* data storage with mongodb
* unit testing and app level testing
* integration with Google jsapi visualization

## What this application does

Allow a multi-user, password control, access to a single-page application,
to enter/update the daily weight, and display various graphs and trends.

The logic is to store only one value per day - hence, dates are normalized, and upsert is used.

## Install and test

1. Make sure you have the latest mongo server installed locally
2. Clone this repo
3. Optionally, run the ./test/import.sh script to load test data
4. Execute ./run.sh from the repo root
5. Connect on localhost:8080 with a brower

## Editing comfort with Atom

* Atom/linter-jshint setups for comfortable development,
* Uses Atom-typescript and linter-tslint for typescript
* Configuration disables compileOnSave for ts (since it is transpiled in the browser)
* npm install angular2 without the dependencies - used only for type checking

## Current status

Working with Angular2-beta.0
Successfully integrated with Google jsapi visualization libs !

## TODOs, bugs and ideas ...

* Direct access inner urls do not work ?
* Improve error handling ?
