
import {Component} from "angular2/core";
import {RouteConfig, RouterLink, RouterOutlet, ROUTER_PROVIDERS } from "angular2/router";

import {ContentComponent} from "./content.component.ts";
import {LoginComponent} from "./login.component.ts";
import {MyModel} from "./mymodel.service.ts";

// ==============================================================================
// -- Main App
// ==============================================================================

@Component({
  selector: "app",
  template: `
      <div class="h1">Hello World from app</div>
      <a [routerLink]="['Login']">Login</a>
      <a [routerLink]="['Content']">Content</a>
      <hr/>
      <router-outlet></router-outlet>
      `,
  directives : [ContentComponent, LoginComponent, RouterLink, RouterOutlet],
  viewProviders: [ ROUTER_PROVIDERS, MyModel ]

})
@RouteConfig([
  {path: "/login",        name: "Login",        component: LoginComponent   },
  {path: "/content",      name: "Content",      component: ContentComponent }
])
export class AppComponent {
  constructor() {
    console.log("Constructing Main App");
  }

}
