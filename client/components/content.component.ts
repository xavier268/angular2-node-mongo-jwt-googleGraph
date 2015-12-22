import {Component} from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {MyModel} from "./mymodel.service.ts";
import {ChartDirective} from "./chart.directive.ts";

@Component({
    selector: "content",
    templateUrl: "/components/content.template.html",
  directives: [CORE_DIRECTIVES, ChartDirective]

})
export class ContentComponent  {

  constructor(private model: MyModel) {
      console.log("Constructing content component");
  }

  savePoids() {
    this.model.savePoids();
  }

}
