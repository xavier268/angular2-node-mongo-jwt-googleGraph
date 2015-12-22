
import {Component} from "angular2/core";
import {RouteConfig, RouterLink, RouterOutlet, ROUTER_PROVIDERS } from "angular2/router";
import {HTTP_PROVIDERS} from "angular2/http";

import {ContentComponent} from "./content.component.ts";
import {LoginComponent} from "./login.component.ts";
import {ChartComponent} from "./chart.component.ts";
import {MyModel} from "./mymodel.service.ts";

// ==============================================================================
// -- Main App
// ==============================================================================

@Component({
  selector: "app",
  templateUrl: "/components/app.template.html",
  directives: [ContentComponent, LoginComponent, RouterLink, RouterOutlet],
  viewProviders: [ROUTER_PROVIDERS, HTTP_PROVIDERS, MyModel]

})
@RouteConfig([
  { path: "/login", name: "Login", component: LoginComponent, useAsDefault: true },
  { path: "/content", name: "Content", component: ContentComponent },
  { path: "/chart", name: "Chart", component: ChartComponent }
])
export class AppComponent {
  constructor() {
    console.log("Constructing Main App");
  }

}
