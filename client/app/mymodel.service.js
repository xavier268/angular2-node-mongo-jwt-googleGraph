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
        this.quand = null; // date being edited
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
        this.http.delete("/_logic/roles/" + this.user);
        this.jwt = "";
        this.content = [];
        this.user = "";
        this.lasterror = "";
    };
    // Login and save the returned jason-web-token
    //      optional callBack is called with no arguments on completion
    //      content property is updated automatically
    MyModel.prototype.login_old = function (user, password, callBack) {
        var _this = this;
        var body = JSON.stringify({ "user": user, "password": password });
        var options = { "headers": new http_1.Headers({ "Content-Type": "application/json" }) };
        this.jwt = ""; // erase first, so if error is thrown, user is logged out.
        this.http.post("/jwt", body, options)
            .subscribe(
        // Success handler
        function (rep) {
            console.log("Answer is : ", rep);
            _this.jwt = rep.text();
            if (_this.jwt) {
                _this.getPoids(callBack);
                _this.user = user;
            }
            else {
                _this.content = [];
                _this.jwt = "";
                _this.user = "";
                _this.lasterror = "Login refused !";
            }
        }, 
        // Error handler
        function (err) {
            console.log("There was an error during login ?");
            console.log(err);
        }, 
        // on complete handler
        function () {
            console.log("Completed login");
        });
    };
    // Save a new records, based on kg and quand
    //       callBack is called with no arguments on success.
    //       content is updated automatically
    MyModel.prototype.savePoids = function (callBack) {
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
        params.set("sort_by", "quand");
        params.set("pagesize", "10");
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
            console.log("JSon rep = ", _this.content);
            console.log("JSon rep date # 2 = ", _this.content[2].quand.$date);
            for (var i = 0; i < _this.content.length; i++) {
                //      this.content[i].quand = (new Date(this.content[i].quand.$date)).toISOString();
                _this.content[i].quand = (new Date(_this.content[i].quand.$date));
            }
            if (callBack)
                callBack();
        });
    };
    // Get list of poids records
    //     callBack is called with no arguments on success
    //     private, beacause it should never be necessary to call it directly.
    MyModel.prototype.getPoids_old = function (callBack) {
        var _this = this;
        var options = { "headers": new http_1.Headers({ "Authorization": "Bearer " + this.jwt }) };
        this.http.get("/api/poids", options)
            .subscribe(function (rep) {
            console.log("Answer is : ", rep);
            if (rep.status !== 200) {
                _this.lasterror = rep.statusText;
            }
            else {
                _this.lasterror = "";
            }
            ;
            _this.content = rep.json();
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
