import {Component } from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {ChartDirective} from "./chart.directive.ts";
/* global google */
@Component({
  selector: "chartPage",
  template: `Chart component
    <br/>
    <chart></chart>
    <hr/>

     `,
  directives: [CORE_DIRECTIVES, ChartDirective]

})
export class ChartComponent {

  constructor() {
    console.log("Constructing chart component");
  };
}
