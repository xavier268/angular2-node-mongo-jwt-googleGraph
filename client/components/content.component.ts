import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {MyModel} from "./mymodel.service.ts";

@Component({
    selector: "content",
    templateUrl: "/components/content.template.html",
  directives: [CORE_DIRECTIVES]

})
export class ContentComponent implements OnInit {

  constructor(private model: MyModel) {
      console.log("Constructing content component");
  }

  getPoids() {
    this.model.getPoids();
  }

  ngOnInit() { // Implementing lifeCycle Hook, to initialize list ...
    console.log("Initializing list");
    this.getPoids();
  }

  savePoids() {
    this.model.savePoids();
  }

}
