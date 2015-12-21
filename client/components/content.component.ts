import {Component} from "angular2/core";

import {MyModel} from "./mymodel.service.ts";

@Component({
    selector: "content",
    template: `
        <h2>Hello from content</h2>
    `
})
export class ContentComponent {

  constructor(model: MyModel) {
      console.log("Constructing content component");
  }


}
