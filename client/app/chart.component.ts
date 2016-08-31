import {Component } from "@angular/core";
import {CORE_DIRECTIVES } from "@angular/common";

import {MyModel} from "./mymodel.service";

/* global google */
@Component({
  selector: "chartPage",
  templateUrl: "app/chart.template.html"

})
export class ChartComponent {

  nbd: Date = new Date("2014/01/01");

  setDate(s: string) {
    this.nbd = new Date(s);
    console.log(s, " --> ", this.nbd);
  }

  constructor(private model: MyModel) {
    console.log("Constructing chart component");
  };
}
