import {Directive, OnInit, ElementRef} from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {MyModel} from "./mymodel.service.ts";
/* global google */
@Directive({
    selector: "chart"
})
export class ChartDirective implements OnInit {

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

  draw() {
    console.log("Testing ...");
        // Create the data table.
        this.data = new window.google.visualization.DataTable();
        this.data.addColumn("date", "Quand");
        this.data.addColumn("number", "KG");
        let rows = [];
        for (let c in this.model.content) {
          let d: Date = new Date(this.model.content[c].quand);
          let k: number = +(this.model.content[c].kg); // Plus sign to force conversion sting -> number
          rows.push([d, k]);
        }
        this.data.addRows(rows);
        // Create options
        this.options = {"title": "User : " + this.model.user,
                       "width": 600,
                       "height": 300,
                       "curveType": "function" };

        // Instantiate and draw our chart, passing in some options.
        (new window.google.visualization.LineChart(this.el))
        .draw(this.data, this.options);
  }

  ngOnInit() { // Implementing lifeCycle Hook, to initialize list ...
    console.log("Initializing list");
    this.draw();
  }


}
