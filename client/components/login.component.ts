import {Component} from "angular2/core";

import {MyModel} from "./mymodel.service.ts";



@Component({
  selector: "login",
  templateUrl: "/components/login.template.html"
})
export class LoginComponent {

  user: string = "test";
  password: string = "passwd";
  constructor(private model: MyModel) {
    console.log("Constructing login component");
  }

  // Login user, using provided password.
  login() {
    console.log("Trying to log in " + this.user);
    this.model.login(this.user, this.password);
  }

  // Logout user
  logout() {
    this.model.logout();
  }



}
