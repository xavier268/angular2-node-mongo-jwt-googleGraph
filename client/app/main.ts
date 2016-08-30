/* Dynamically load and compile in browser */

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module" ;

platformBrowserDynamic().bootstrapModule(AppModule);
