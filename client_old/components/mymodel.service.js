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
var core_1 = require("angular2/core");
var http_1 = require("angular2/http");
var MyModel = (function () {
    function MyModel(http) {
        this.http = http;
        this.jwt = "";
        this.kg = 0;
        this.quand = null;
        this.content = [];
        this.user = "";
        this.lasterror = "";
        console.log("Constructing MyModel Service");
    }
    MyModel.prototype.logout = function () {
        console.log("Logging out ...");
        this.jwt = "";
        this.content = [];
        this.user = "";
        this.lasterror = "";
    };
    MyModel.prototype.login = function (user, password, callBack) {
        var _this = this;
        var body = JSON.stringify({ "user": user, "password": password });
        var options = { "headers": new http_1.Headers({ "Content-Type": "application/json" }) };
        this.jwt = "";
        this.http.post("/jwt", body, options)
            .subscribe(function (rep, err) {
            if (err) {
                console.log("Error : ", err);
                _this.lasterror = "Login refused !";
                throw err;
            }
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
        });
    };
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
            .subscribe(function (rep, err) {
            if (err) {
                console.log("Error : ", err);
                _this.lasterror = "Cannot save to db !";
                throw err;
            }
            console.log("Answer is : ", rep);
            _this.getPoids(callBack);
        });
    };
    MyModel.prototype.getPoids = function (callBack) {
        var _this = this;
        var options = { "headers": new http_1.Headers({ "Authorization": "Bearer " + this.jwt }) };
        this.http.get("/api/poids", options)
            .subscribe(function (rep, err) {
            if (err) {
                console.log("Error : ", err);
                _this.lasterror = "Cannot get content from db !";
                throw err;
            }
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
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], MyModel);
    return MyModel;
    var _a;
}());
exports.MyModel = MyModel;
