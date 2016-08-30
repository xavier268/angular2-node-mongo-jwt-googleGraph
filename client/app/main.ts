/* This is the main entrypoint for the app application */
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";
platformBrowserDynamic().bootstrapModule(AppModule);
console.info("Running main.ts/js");
