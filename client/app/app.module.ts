/* This defines the app module, containing the application */
import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTTP_PROVIDERS } from "@angular/http";
import { MyModel } from "./mymodel.service";

import { AppComponent }  from "./app.component";

@NgModule({
  imports:      [ BrowserModule, FormsModule, CommonModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ HTTP_PROVIDERS, MyModel ]
})

export class AppModule { }
