import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

require("./styles/main.css");

platformBrowserDynamic().bootstrapModule(AppModule);
