import {Component, bootstrap} from 'angular2/angular2';

//==============================================================================
// -- Main App
//==============================================================================
@Component({
    selector: 'app',
    template: `
      <div class="h1">Hello World !</div>
      It is using bootstrap ...
      `
    })

class AppComponent {
  constructor( ) {
    console.log("Constructing Main App");
  }
}

//==============================================================================
// -- boostrap application
//==============================================================================

bootstrap(AppComponent);
