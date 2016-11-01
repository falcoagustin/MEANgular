import { Component, ViewChild } from '@angular/core';
import { MapComponent } from './map.component';

@Component({
    selector: 'my-app',
    template:
    `
      <esri-map [itemId]="itemId" [options]="mapOptions" (mapLoaded)="onMapLoad($event)">
      </esri-map>
    `
})
export class AppComponent {

  // references to child components
  @ViewChild(MapComponent) mapComponent:MapComponent;

  // map config
  itemId = '8e42e164d4174da09f61fe0d3f206641';
  public mapOptions = {
    basemap: 'streets',
    center: [-97, 38], // lon, lat
    zoom: 5
  };
}
