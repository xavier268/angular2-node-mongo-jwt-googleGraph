
/**
*           A service object, storing the data being edited,
*           and providing async http access to DB content
**/

import {Injectable} from "@angular/core";
import {Http, Headers,
RequestOptions, RequestOptionsArgs,
ResponseContentType, URLSearchParams } from "@angular/http";

// Add the RxJS Observable operators we need in this app.
// import "./rxjs-operators"; // NOT NEEDED ...

@Injectable() // Absolutely required here, because MyModel is being injected Http
// Note that the doc recommands to use @Injectable anyway, even
// when no subservice is being injected
export class MyModel {

  jwt: string = "";     // authentication token
  kg: number = 0;       // weight value being edited
  quand: Date = new Date();   // date being edited
  content: any[] = [];  // List of data in the db for the selected user
  user: string = "";    // user logged in
  lasterror = "";       // last error if any

  // Constructor inject Http object for async rest api access
  // Only ONE service instance is constructed for the entire application
  // HTTP_PROVIDERS needs to be available (here, at module level)
  constructor(private http: Http) {
    console.log("Constructing MyModel Service");
  }

  // Login and save the returned jason-web-token
  //      optional callBack is called with no arguments on completion
  //      content property is updated automatically
  login(user: string, password: string, callBack?: () => void) {
    this.jwt = ""; // erase first, so if error is thrown, user is logged out.
    let options = new RequestOptions({
      "headers": new Headers({ "Authorization": "Basic " + btoa(user + ":" + password) }),
      "withCredentials": true,
      "responseType": ResponseContentType.Json
    });
    this.http
      .get("/_logic/roles/" + user, options)
      .subscribe(
      // success
      (rep) => {
        console.log(rep);
        if (rep.status !== 200) {
          console.log("Unexpected http status !? - aborting ...");
          this.logout();
          return;
        }
        console.log("Success login for: " + user);
        this.user = user;
        this.jwt = "Basic " + btoa(user + ":" + rep.headers.get("Auth-Token"));
        this.getPoids(callBack);
      },
      // Error handler
      (err) => {
        console.log("There was an error during login ?");
        console.log(err);
      }
      );
  }

  // Logout user
  logout() {
    console.log("Logging out ...");
    let headers = new Headers({ "Authorization": this.jwt });
    let options = new RequestOptions();
    options.headers = headers;
    this.http.delete("/_authtokens/" + this.user, options)
      .subscribe(() => { console.log("Disconnected from server"); });
    this.jwt = "";
    this.content = [];
    this.user = "";
    this.lasterror = "Logged out !";
  }



  // Save a new records, based on kg and quand
  //       callBack is called with no arguments on success.
  //       content is updated automatically
  savePoids(callBack?: () => void) {
    let headers = new Headers({ "Authorization": this.jwt });
    headers.set("Content-Type", "application/json");

    let options = new RequestOptions();
    options.headers = headers;

    // Normalize date for daily unicity ..
    let normDate = new Date(this.quand);
    normDate.setUTCHours(12);

    let body = JSON.stringify({
      "kg": this.kg,
      "quand": { "$date": normDate.getTime() },
      "email": this.user + "@test.com"
    });
    this.http.post("/api/sldb/poids", body, options)
      .subscribe(
      // Success handler
      (rep) => {
        console.log("Answer is : ", rep);
        console.log("Successful write");
        // And now, we refresh the list ...
        this.getPoids(callBack);
      },
      // error handler
      (err) => {
        console.log("Failed write - assuming already existing document with same email/date");
        console.log("We are now trying to PATCH the existing record");
        let params = new URLSearchParams();
        params.set(
          "filter",
          JSON.stringify({
            "quand": { "$date": normDate.getTime() },
            "email": this.user + "@test.com"
          }));
        options.search = params;
        let body = JSON.stringify({
          "kg": this.kg
        });
        this.http.patch("/api/sldb/poids/*", body, options)
          .subscribe((rep) => {
          console.log("Success write on second attempt !");
          // And now, we refresh the list ...
          this.getPoids(callBack);
        });
      }
      );
  }

  // Save a new records, based on kg and quand
  //       callBack is called with no arguments on success.
  //       content is updated automatically
  savePoids_old(callBack?: () => void) {
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
    // It does not work to just "manually" add the params to the url !!
    let params = new URLSearchParams();
    params.set("sort_by", "-quand");
    params.set("pagesize", "1000");
    params.set("filter", JSON.stringify({"email": this.user + "@test.com"}));

    let headers = new Headers({ "Authorization": this.jwt });

    let options = new RequestOptions();
    options.search = params;
    options.headers = headers;

    this.http.get("/api/sldb/poids", options)
      .subscribe((rep) => {
      console.log("Answer is : ", rep);
      if (rep.status !== 200) { this.lasterror = rep.statusText; } else { this.lasterror = ""; };
      this.content = rep.json()._embedded["rh:doc"];
      // We need to adapt the date format from BSON to js,
      // in order not to break compatibility with client
      for (let i = 0; i < this.content.length; i++) {
        this.content[i].quand = (new Date(this.content[i].quand.$date));
      }
      if (callBack) callBack();
    });
  }



}
