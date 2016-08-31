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
/* Main componanet called by the application **/
var core_1 = require("@angular/core");
var mymodel_service_1 = require("./mymodel.service");
var AppComponent = (function () {
    function AppComponent(model) {
        this.model = model;
        console.log("Constructing Main App");
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: "app",
            templateUrl: "app/app.template.html"
        }), 
        __metadata('design:paramtypes', [mymodel_service_1.MyModel])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
