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
  quand: Date = new Date();
  content: any[] = [];

// Constructor inject Http object for async rest api access
  constructor(private http: Http) {
    console.log("Constructing MyModel Service");
  }

// Logout user
  logout() {
    console.log("Logging out ...");
    this.jwt = "";
    this.content = [];
  }

// Login and save the returned jason-web-token
  login(user: string, password: string) {
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
          });
  }

  // Save a new records, based on kg and quand.
  savePoids() {
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
        this.getPoids();
      });


  }

  // Get list of poids records
  getPoids() {
    let options = {"headers": new Headers({"Authorization" : "Bearer " + this.jwt})};
    this.http.get("/api/poids", options)
        .subscribe((rep, err) => {
          if (err) {
            console.log("Error : ", err );
            throw err;
          }
          console.log("Answer is : ", rep );
          this.content = rep.json();
          });
  }



}
