import {Component, OnInit, ElementRef} from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {MyModel} from "./mymodel.service.ts";

@Component({
    selector: "chart",
    template: `Chart component
    <br/>
    <span (click)="test()">click to draw test chart</span>
    <hr/>
    DEBUG : {{model.content}}

     `,
  directives: [CORE_DIRECTIVES]

})
export class ChartComponent implements OnInit {

data: any;
options: any;
el: HTMLElement ;

  constructor(
    elementRef: ElementRef,
    private model: MyModel) {
      console.log("Constructing chart component");
      this.el = elementRef.nativeElement;
      console.log("Native HTML :", this.el);
      console.log("Google :", window.google);
  }

  test() {
    console.log("Testing ...");
        // Create the data table.
        this.data = new window.google.visualization.DataTable();
        this.data.addColumn("string", "Topping");
        this.data.addColumn("number", "Slices");
        this.data.addRows([
          ["Mushrooms", 3],
          ["Onions", 1],
          ["Olives", 1],
          ["Zucchini", 1],
          ["Pepperoni", 2]
        ]);
        // Create options
        this.options = {"title": "How Much Pizza I Ate Last Night",
                       "width": 400,
                       "height": 300};

        // Instantiate and draw our chart, passing in some options.
        (new window.google.visualization.PieChart(this.el))
        .draw(this.data, this.options);
  }

  ngOnInit() { // Implementing lifeCycle Hook, to initialize list ...
    console.log("Initializing list");
    this.model.getPoids();
    this.test();
  }


}
