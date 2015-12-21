/**
*           A service object, storing the data being edited,
*           and providing async http access
**/

import {Injectable} from "angular2/core";

@Injectable()
export class MyModel {

  constructor() {
    console.log("Constructing MyModel Service");
  }

  private jwt: string = "";
  kg: number = 0;
  quand: Date = new Date();
  email: string = "";

}
