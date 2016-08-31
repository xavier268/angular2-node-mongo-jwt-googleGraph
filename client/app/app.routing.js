/* We define here the routing configuration of our app */
"use strict";
var router_1 = require("@angular/router");
var login_component_1 = require("./login.component");
var chart_component_1 = require("./chart.component");
var content_component_1 = require("./content.component");
var appRoutes = [
    { path: "", component: login_component_1.LoginComponent },
    { path: "chart", component: chart_component_1.ChartComponent },
    { path: "content", component: content_component_1.ContentComponent }
];
exports.MY_ROUTING_PROVIDERS = [];
exports.MY_ROUTER = router_1.RouterModule.forRoot(appRoutes);
