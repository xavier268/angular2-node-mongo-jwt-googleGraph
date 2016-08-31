/* Main componanet called by the application **/
import { Component } from "@angular/core";
import { MyModel } from "./mymodel.service";
@Component({
  selector: "app",
  template: "<h1>My First Angular 2 App</h1>"
})
export class AppComponent {
  constructor(private model: MyModel) {
    console.log("Constructing Main App");
    model.login(
      "test",
      "passwd",
      () => {
        console.log("WebToken :");
        console.log(model.jwt);
      });
  }
}
