import {Component} from "angular2/core";

import {MyModel} from "./mymodel.service.ts";



@Component({
    selector: "login",
    template: `
        <h2>Hello from login</h2>
        <form>

          <label for="name">User</label>
          <input type="text" required [(ngModel)]="user" >

          <label for="alterEgo">Password</label>
          <input type="text" [(ngModel)]="password">

          <button type="submit" (click)="login()" >Log In</button>
          <button type="cancel" (click)="logout()" >Log Out</button>

        </form>
        <br/>jwt = {{model.jwt}}
    `
})
export class LoginComponent {

  user: string = "test";
  password: string = "passwd";
  constructor(private model: MyModel) {
      console.log("Constructing login component");
  }

// Login user, using provided password.
  login() {
    console.log("Trying to log in " + this.user ) ;
    this.model.login(this.user, this.password);
  }

// Logout user
  logout() {
    this.model.logout();
  }



}
