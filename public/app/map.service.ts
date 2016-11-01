import { Injectable } from '@angular/core';
import Map = require('esri/map');


@Injectable()
export class MapService {
  initializeMap(itemId: any, options: Object) {
    return new Map(itemId, options);
  }
}
