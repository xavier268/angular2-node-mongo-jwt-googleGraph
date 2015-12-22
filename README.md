# Verdant-Prune : A full-fledged proof-of-concept

## Application is demontrating

* Node v5.1 with ES6 (server) and TypeScript(client)
* Angular2 client
* RESTFull API
* time-bounded access control using jwt,
* data storage with mongodb
* unit testing and app level testing
* integration with Google jsapi visualization

## What this application does

Allow a multi-user, password control, access to a single-page application,
to enter/update the daily weight, and display various graphs and trends.

## Editing comfort with Atom

* Atom/linter-jshint setups for comfortable development,
* Uses Atom-typescript and linter-tslint for typescript
* Configuration disables compileOnSave for ts (since it is transpiled in the browser)
* npm install angular2 without the dependencies - used only for type checking

## Current status

Working with Angular2-beta.0
Successfully integrated with Google jsapi visualization libs !

## TODOs, bugs and ideas ...

* Direct access inner urls does not work ?
* Implement a date picker or a slider to zoom on the chart ?
