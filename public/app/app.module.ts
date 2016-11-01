import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { MapComponent } from './map.component';
import { AppComponent }  from './app.component';

import { MapService } from './map.service';
import { DonatorService } from './donator.service';
import { UserInformationComponent } from './user-information.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    MapComponent,
    UserInformationComponent
  ],
  providers: [
    MapService,
    DonatorService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
