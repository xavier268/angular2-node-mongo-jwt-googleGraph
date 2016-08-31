/* Main componanet called by the application **/
import { Component } from "@angular/core";
import { MyModel } from "./mymodel.service";
@Component({
  selector: "app",
  templateUrl: "app/app.template.html"
})
export class AppComponent {
  constructor(private model: MyModel) {
    console.log("Constructing Main App");
  }
}
