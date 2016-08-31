/**
*      This directive will draw a chart from the array of records provided
*
*           Note : the relevant jsapi scripts should be already available
*                  globally in the window.google object (see index.html)
**/

import {Directive, ElementRef, Input} from "@angular/core";
import {CORE_DIRECTIVES } from "@angular/common";

@Directive({
  selector: "chart",
})
export class ChartDirective {

  el: HTMLElement;
  w: any;  // To store the window, without generating errors in typescript on window.google
  private _content: any[] = [];
  private _title: string = "";
  private _nbd: Date = new Date(0);

  // Setter for content will trigger drawing (or refreshing)
  @Input()
  set content(c: any[]) {
    console.log("Setting content ...");
    this._content = c;
    this.draw();
  }
  get content() { return this._content; }


  // title will appear above graph if not null
  @Input()
  set title(t: string) { this._title = t; this.draw(); }
  get title() { return this._title; }

  // Exclude records that are before that date
  //  (use for zooming ...)
  @Input()
  set notBefore(d: Date) { this._nbd = d; this.draw(); }
  get notBefore() { return this._nbd; }

  constructor(elementRef: ElementRef) {
    console.log("Constructing chart directive");
    this.w = window;
    this.el = elementRef.nativeElement;
    // console.log("Native HTML :", this.el);
    if (!this.w.google) { console.error("Hey ! It seems the need google script was not loaded ?"); };
  }

  draw() {
    // Create the data table.
    let data = new this.w.google.visualization.DataTable();
    data.addColumn("date", "Quand");
    data.addColumn("number", "KG");
    let rows = [];
    for (let c in this._content) {
      let d: Date = new Date(this._content[c].quand);
      let k: number = +(this._content[c].kg); // Plus sign to force conversion sting -> number
      // Only take into account records after the 'notBefore date'
      if (d >= this._nbd) rows.push([d, k]);
    }
    data.addRows(rows);
    // Create options
    let options: any = {
      // "width": 600,
      "height": 300,
      "curveType": "function"
    };
    if (this._title) options.title = this._title;

    // Instantiate and draw our chart, passing in some options.
    (new this.w.google.visualization.LineChart(this.el))
      .draw(data, options);
  }


}
