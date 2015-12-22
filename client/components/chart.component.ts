import {Component } from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {MyModel} from "./mymodel.service.ts";
import {ChartDirective} from "./chart.directive.ts";
/* global google */
@Component({
  selector: "chartPage",
  template: `Chart component
    <br/>
    Not before (yyyy/mm/dd): <input #ip (blur)="setDate(ip.value)" value="2014/01/01"/> DEBUG : {{nbd}}
    <br/>
    To validate, just exit the input box : press Tab or click outside ...
    <chart [content]="model.content" [title]="'User : ' + model.user" [notBefore]="nbd"></chart>
    <hr/>
     `,
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
