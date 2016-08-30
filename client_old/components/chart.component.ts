import {Component } from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {MyModel} from "./mymodel.service.ts";
import {ChartDirective} from "./chart.directive.ts";
/* global google */
@Component({
  selector: "chartPage",
  templateUrl: "/components/chart.template.html",
  directives: [CORE_DIRECTIVES, ChartDirective]

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
