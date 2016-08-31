
/**
*           A service object, storing the data being edited,
*           and providing async http access to DB content
**/

import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptionsArgs} from "@angular/http";

// Add the RxJS Observable operators we need in this app.
// import "./rxjs-operators"; // NOT NEEDED ...

@Injectable() // Absolutely required here, because MyModel is being injected Http
              // Note that the doc recommands to use @Injectable anyway, even
              // when no subservice is being injected
export class MyModel {

  jwt: string = "";     // authentication token
  kg: number = 0;       // weight value being edited
  quand: Date = null;   // date being edited
  content: any[] = [];  // List of data in the db for the selected user
  user: string = "";    // user logged in
  lasterror = "";       // last error if any

  // Constructor inject Http object for async rest api access
  // Only ONE service instance is constructed for the entire application
  // HTTP_PROVIDERS needs to be available (here, at module level)
  constructor(private http: Http) {
    console.log("Constructing MyModel Service");
  }

  // Logout user
  logout() {
    console.log("Logging out ...");
    this.jwt = "";
    this.content = [];
    this.user = "";
    this.lasterror = "";
  }

  // Login and save the returned jason-web-token
  //      optional callBack is called with no arguments on completion
  //      content property is updated automatically
  login(user: string, password: string, callBack?: () => void) {
    let body = JSON.stringify({ "user": user, "password": password });
    let options = { "headers": new Headers({ "Content-Type": "application/json" }) };
    this.jwt = ""; // erase first, so if error is thrown, user is logged out.
    this.http.post("/jwt", body, options)
      .subscribe(
      // Success handler
      (rep) => {
        console.log("Answer is : ", rep);
        this.jwt = rep.text();
        if (this.jwt) {
          this.getPoids(callBack);
          this.user = user;
        } else {
          this.content = [];
          this.jwt = "";
          this.user = "";
          this.lasterror = "Login refused !";
        }
      },
      // Error handler
      (err) => {
        console.log("There was an error during login ?");
        console.log(err);
      },
      // on complete handler
      () => {
        console.log("Completed login");
      }
      );
  }

  // Save a new records, based on kg and quand
  //       callBack is called with no arguments on success.
  //       content is updated automatically
  savePoids(callBack?: () => void) {
    let options = {
      "headers": new Headers({
        "Authorization": "Bearer " + this.jwt,
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify({ "kg": this.kg, "quand": this.quand });
    this.http.post("/api/poids", body, options)
      .subscribe((rep) => {
      console.log("Answer is : ", rep);
      // And now, we refresh the list ...
      this.getPoids(callBack);
    });


  }

  // Get list of poids records
  //     callBack is called with no arguments on success
  //     private, beacause it should never be necessary to call it directly.
  private getPoids(callBack?: () => void) {
    let options = { "headers": new Headers({ "Authorization": "Bearer " + this.jwt }) };
    this.http.get("/api/poids", options)
      .subscribe((rep) => {
      console.log("Answer is : ", rep);
      if (rep.status !== 200) { this.lasterror = rep.statusText; } else { this.lasterror = ""; };
      this.content = rep.json();
      if (callBack) callBack();
    });
  }



}
