import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES } from "angular2/common";

import {MyModel} from "./mymodel.service.ts";

@Component({
    selector: "content",
    template: `
        <h2>Hello from content</h2>
        <form>
        Poids : <input [(ngModel)]="model.kg" />
        Date : <input [(ngModel)]="model.quand" />

          <button (click)="savePoids()" >Save</button>
          <button (click)="getPoids()" >List</button>
          <hr/>
          <table>
            <tr *ngFor="#c of model.content"><td>{{c.email}}</td><td>{{c.kg}}</td><td>{{c.quand}}</td></tr>
          </table>
        </form>
    `,
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
