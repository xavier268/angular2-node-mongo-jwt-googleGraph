import {Component} from "angular2/core";

import {MyModel} from "./mymodel.service.ts";


@Component({
    selector: "login",
    template: `
        <h2>Hello from login</h2>
    `
})
export class LoginComponent {

  constructor(model: MyModel) {
      console.log("Constructing login component");
  }


}
