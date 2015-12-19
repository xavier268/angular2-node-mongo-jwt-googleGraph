

import {Component, bootstrap} from 'angular2/core';

//==============================================================================
// -- Main App
//==============================================================================
@Component({
    selector: 'app',
    template: `
      <div class="h1">Hello World !</div>
      `
    })

export class AppComponent {
  constructor( ) {
    console.log("Constructing Main App");
  }
}
