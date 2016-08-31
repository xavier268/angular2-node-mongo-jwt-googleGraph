import {Component} from "@angular/core";
import {CORE_DIRECTIVES } from "@angular/common";

import {MyModel} from "./mymodel.service";


@Component({
  selector: "content",
  templateUrl: "app/content.template.html"
})
export class ContentComponent {

  constructor(private model: MyModel) {
    console.log("Constructing content component");
  }

  savePoids() {
    this.model.savePoids();
  }

}
