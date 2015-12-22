/**
*           A service object, storing the data being edited,
*           and providing async http access
**/

import {Injectable} from "angular2/core";
import {Http, Headers, RequestOptionsArgs} from "angular2/http";

@Injectable() // Absolutely required, because MyModel is being injected Http
export class MyModel {

  jwt: string = "";
  kg: number = 0;
  quand: Date = null;
  content: any[] = [];
  user: string= "";

// Constructor inject Http object for async rest api access
  constructor(private http: Http) {
    console.log("Constructing MyModel Service");
  }

// Logout user
  logout() {
    console.log("Logging out ...");
    this.jwt = "";
    this.content = [];
    this.user = "";
  }

// Login and save the returned jason-web-token
//      callBack is called with no arguments on completion
//      content property is updated automatically
  login(user: string, password: string, callBack?: () => void ) {
    let body = JSON.stringify({"user": user, "password": password});
    let options = {"headers": new Headers({"Content-Type" : "application/json"})};
    this.jwt = ""; // erase first, so if error is thrown, user is logged out.
    this.http.post("/jwt", body, options)
        .subscribe((rep, err) => {
          if (err) {
            console.log("Error : ", err );
            throw err;
          }
          console.log("Answer is : ", rep );
          this.jwt = rep.text();
          if (this.jwt) {this.getPoids(callBack); this.user = user; }else {this.content = []; this.jwt = ""; this.user = ""; }
          });
  }

  // Save a new records, based on kg and quand
  //       callBack is called with no arguments on success.
  //       content is updated automatically
  savePoids(callBack?: () => void ) {
    let options = {"headers": new Headers({
          "Authorization" : "Bearer " + this.jwt,
          "Content-Type" : "application/json"
          })};
    let body = JSON.stringify({ "kg": this.kg, "quand": this.quand });
    this.http.post("/api/poids", body, options)
      .subscribe((rep, err) => {
        if (err) {
          console.log("Error : ", err );
          throw err;
        }
        console.log("Answer is : ", rep);
        // And now, we refresh the list ...
        this.getPoids(callBack);
      });


  }

  // Get list of poids records
  //     callBack is called with no arguments on success
  //     private, beacause it should never be necessary to call it directly.
  private getPoids( callBack?: () => void ) {
    let options = {"headers": new Headers({"Authorization" : "Bearer " + this.jwt})};
    this.http.get("/api/poids", options)
        .subscribe((rep, err) => {
          if (err) {
            console.log("Error : ", err );
            throw err;
          }
          console.log("Answer is : ", rep );
          this.content = rep.json();
          if (callBack) callBack();
          });
  }



}
