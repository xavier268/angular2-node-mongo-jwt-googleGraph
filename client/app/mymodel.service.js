/**
*           A service object, storing the data being edited,
*           and providing async http access to DB content
**/
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
// Add the RxJS Observable operators we need in this app.
// import "./rxjs-operators"; // NOT NEEDED ...
var MyModel = (function () {
    // Constructor inject Http object for async rest api access
    // Only ONE service instance is constructed for the entire application
    // HTTP_PROVIDERS needs to be available (here, at module level)
    function MyModel(http) {
        this.http = http;
        this.jwt = ""; // authentication token
        this.kg = 0; // weight value being edited
        this.quand = new Date(); // date being edited
        this.content = []; // List of data in the db for the selected user
        this.user = ""; // user logged in
        this.lasterror = ""; // last error if any
        console.log("Constructing MyModel Service");
    }
    // Login and save the returned jason-web-token
    //      optional callBack is called with no arguments on completion
    //      content property is updated automatically
    MyModel.prototype.login = function (user, password, callBack) {
        var _this = this;
        this.jwt = ""; // erase first, so if error is thrown, user is logged out.
        var options = new http_1.RequestOptions({
            "headers": new http_1.Headers({ "Authorization": "Basic " + btoa(user + ":" + password) }),
            "withCredentials": true,
            "responseType": http_1.ResponseContentType.Json
        });
        this.http
            .get("/_logic/roles/" + user, options)
            .subscribe(
        // success
        function (rep) {
            console.log(rep);
            if (rep.status !== 200) {
                console.log("Unexpected http status !? - aborting ...");
                _this.logout();
                return;
            }
            console.log("Success login for: " + user);
            _this.user = user;
            _this.jwt = "Basic " + btoa(user + ":" + rep.headers.get("Auth-Token"));
            _this.getPoids(callBack);
        }, 
        // Error handler
        function (err) {
            console.log("There was an error during login ?");
            console.log(err);
        });
    };
    // Logout user
    MyModel.prototype.logout = function () {
        console.log("Logging out ...");
        var headers = new http_1.Headers({ "Authorization": this.jwt });
        var options = new http_1.RequestOptions();
        options.headers = headers;
        this.http.delete("/_authtokens/" + this.user, options)
            .subscribe(function () { console.log("Disconnected from server"); });
        this.jwt = "";
        this.content = [];
        this.user = "";
        this.lasterror = "Logged out !";
    };
    // Save a new records, based on kg and quand
    //       callBack is called with no arguments on success.
    //       content is updated automatically
    MyModel.prototype.savePoids = function (callBack) {
        var _this = this;
        var headers = new http_1.Headers({ "Authorization": this.jwt });
        headers.set("Content-Type", "application/json");
        var options = new http_1.RequestOptions();
        options.headers = headers;
        // Normalize date for daily unicity ..
        var normDate = new Date(this.quand);
        normDate.setUTCHours(12);
        var body = JSON.stringify({
            "kg": this.kg,
            "quand": { "$date": normDate.getTime() },
            "email": this.user + "@test.com"
        });
        this.http.post("/api/sldb/poids", body, options)
            .subscribe(
        // Success handler
        function (rep) {
            console.log("Answer is : ", rep);
            console.log("Successful write");
            // And now, we refresh the list ...
            _this.getPoids(callBack);
        }, 
        // error handler
        function (err) {
            console.log("Failed write - assuming already existing document with same email/date");
            console.log("We are now trying to PATCH the existing record");
            var params = new http_1.URLSearchParams();
            params.set("filter", JSON.stringify({
                "quand": { "$date": normDate.getTime() },
                "email": _this.user + "@test.com"
            }));
            options.search = params;
            var body = JSON.stringify({
                "kg": _this.kg
            });
            _this.http.patch("/api/sldb/poids/*", body, options)
                .subscribe(function (rep) {
                console.log("Success write on second attempt !");
                // And now, we refresh the list ...
                _this.getPoids(callBack);
            });
        });
    };
    // Save a new records, based on kg and quand
    //       callBack is called with no arguments on success.
    //       content is updated automatically
    MyModel.prototype.savePoids_old = function (callBack) {
        var _this = this;
        var options = {
            "headers": new http_1.Headers({
                "Authorization": "Bearer " + this.jwt,
                "Content-Type": "application/json"
            })
        };
        var body = JSON.stringify({ "kg": this.kg, "quand": this.quand });
        this.http.post("/api/poids", body, options)
            .subscribe(function (rep) {
            console.log("Answer is : ", rep);
            // And now, we refresh the list ...
            _this.getPoids(callBack);
        });
    };
    // Get list of poids records
    //     callBack is called with no arguments on success
    //     private, beacause it should never be necessary to call it directly.
    MyModel.prototype.getPoids = function (callBack) {
        var _this = this;
        // It does not work to just "manually" add the params to the url !!
        var params = new http_1.URLSearchParams();
        params.set("sort_by", "-quand");
        params.set("pagesize", "1000");
        params.set("filter", JSON.stringify({ "email": this.user + "@test.com" }));
        var headers = new http_1.Headers({ "Authorization": this.jwt });
        var options = new http_1.RequestOptions();
        options.search = params;
        options.headers = headers;
        this.http.get("/api/sldb/poids", options)
            .subscribe(function (rep) {
            console.log("Answer is : ", rep);
            if (rep.status !== 200) {
                _this.lasterror = rep.statusText;
            }
            else {
                _this.lasterror = "";
            }
            ;
            _this.content = rep.json()._embedded["rh:doc"];
            // We need to adapt the date format from BSON to js,
            // in order not to break compatibility with client
            for (var i = 0; i < _this.content.length; i++) {
                _this.content[i].quand = (new Date(_this.content[i].quand.$date));
            }
            if (callBack)
                callBack();
        });
    };
    MyModel = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], MyModel);
    return MyModel;
}());
exports.MyModel = MyModel;
