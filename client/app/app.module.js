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
/* This defines the app module, containing the application */
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_routing_1 = require("./app.routing");
var mymodel_service_1 = require("./mymodel.service");
var chart_directive_1 = require("./chart.directive");
var app_component_1 = require("./app.component");
var login_component_1 = require("./login.component");
var chart_component_1 = require("./chart.component");
var content_component_1 = require("./content.component");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, common_1.CommonModule, app_routing_1.MY_ROUTER],
            declarations: [app_component_1.AppComponent, login_component_1.LoginComponent, content_component_1.ContentComponent, chart_component_1.ChartComponent, chart_directive_1.ChartDirective],
            bootstrap: [app_component_1.AppComponent],
            providers: [http_1.HTTP_PROVIDERS, mymodel_service_1.MyModel, app_routing_1.MY_ROUTING_PROVIDERS]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
