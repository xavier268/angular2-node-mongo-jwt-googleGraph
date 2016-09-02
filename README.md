# angular2-restheart-mongo-jwt-googleGraph

A full-fledged proof-of-concept application to test/demonstrate use and integration of the various technologies.
This git branch demonstrates porting the node backend to a java-based (undertow) REST api, named RestHeart.

## This branch is a port of the original node server to the RestHeart engine

* The goal was to check the feasibility of porting the existing node backend to the restHeart engine (mongo restful api engine).
* It was achieved by only modifying the "model.service.ts" from the client, the rest of the client application was left unchanged.
* The database structure as well was unchanged.

Technically, the port is not 100% functionally identical to the original node implemention, since I had to adapt to the new output format (hal) from restHeart. The security architecture is different, relying on Restheart authentication tokens instead of the node jwt tokens, but the general structure was kept. The most significant effort was required from the date and time  management, that are now returned as BSON dates by Restheart.

Also, at this stage date normalization now happens in the client (however, the database protects the integrity with the index on date/email). This could be improved by configuring a request processor inside RestHeart that normalizes dates at the server side. Such processor could probably also deliver dates in the responses as date strings, instead of BSON, which would be probably faster than the local processing in the client.

## Application is demonstrating

* RestHeart API engine (server) and TypeScript(client)
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
* Uses  compile-On-Save for ts (no more inefficient transpiling in the browser)
* npm install angular2 without the dependencies - used only for type checking

## Current status

* Working with Angular2-rc5 (client) nd restheart-2.0.2 (server)
* Successfully integrated with Google jsapi visualization libs !
