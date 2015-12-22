import {Component } from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {MyModel} from "./mymodel.service.ts";
import {ChartDirective} from "./chart.directive.ts";
/* global google */
@Component({
  selector: "chartPage",
  template: `Chart component
    <br/>
    <chart [content]="model.content" [title]="'User : ' + model.user"></chart>
    <hr/>
     `,
  directives: [CORE_DIRECTIVES, ChartDirective]

})
export class ChartComponent {

  constructor(private model: MyModel) {
    console.log("Constructing chart component");
  };
}
