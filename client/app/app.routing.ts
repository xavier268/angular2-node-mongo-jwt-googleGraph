/* We define here the routing configuration of our app */

import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent }  from "./login.component";
import { ChartComponent }    from "./chart.component";
import { ContentComponent }    from "./content.component";

const appRoutes: Routes = [
  { path: "", component: LoginComponent },
  { path: "chart", component: ChartComponent },
  { path: "content", component: ContentComponent }
];

export const MY_ROUTING_PROVIDERS: any[] = [

];

export const MY_ROUTER: ModuleWithProviders = RouterModule.forRoot(appRoutes);
