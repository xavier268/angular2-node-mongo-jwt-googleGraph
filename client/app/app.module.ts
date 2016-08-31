/* This defines the app module, containing the application */
import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTTP_PROVIDERS } from "@angular/http";


import { MY_ROUTER, MY_ROUTING_PROVIDERS } from "./app.routing";
import { MyModel } from "./mymodel.service";

import { ChartDirective } from "./chart.directive";

import { AppComponent }  from "./app.component";
import { LoginComponent } from "./login.component";
import { ChartComponent } from "./chart.component";
import { ContentComponent } from "./content.component";

@NgModule({
  imports:      [ BrowserModule, FormsModule, CommonModule , MY_ROUTER],
  declarations: [ AppComponent, LoginComponent, ContentComponent, ChartComponent, ChartDirective],
  bootstrap:    [ AppComponent ],
  providers: [ HTTP_PROVIDERS, MyModel, MY_ROUTING_PROVIDERS ]
})

export class AppModule { }
