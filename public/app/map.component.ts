import { Component, ElementRef, ViewChild } from '@angular/core';
import { MapService } from './map.service';
import { Donator } from './models/donator';
import { DonatorService } from './donator.service';

import Draw = require('esri/toolbars/draw');
import Map = require('esri/map');
import on = require('dojo/on');
import SimpleMarkerSymbol = require('esri/symbols/SimpleMarkerSymbol');
import Color = require('esri/Color');
import Graphic = require('esri/graphic');
import Point = require('esri/geometry/Point');
import SpatialReference = require('esri/SpatialReference');
import dom = require('dojo/dom');
import webMercatorUtils = require('esri/geometry/webMercatorUtils');
import IO = require('socket.io-client');

var socket = IO()



const markerPath = "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z"
const markerColor = "#00FFFF";

@Component({
  selector: 'esri-map',
  template: `
  <div class="user-info-container">
    <user-information [display]="displayForm" [information]="showingDonator"></user-information>
  </div>
  <div class="map-container" [class.no-opacity]="hasPinned">
    <div class="main-map" id="mainMap"></div>
    <div id="info">
      <div>Click on button and click on map to make yourself available for donations!</div>
      <button class="btn btn-primary btn-lg" id="Point">Donate!</button>
    </div>
  </div>
  <div class="pin-form" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div #myModal class="my-modal-dialog" [class.opacity]="hasPinned" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="myModalLabel"> Donate blood!</h4>
        </div>
        <div class="modal-body">
          <label class="error" [hidden]="!formError"> * The form has errors: space is needed for conatact number (plus or double-zero also), @ and . are needed in email, and bloodgroup must be valid </label>
          <label class="error" [hidden]="!serverError"> * There has been a problem with the server. Try again later.</label>
          <label class="success" [hidden]="!submitSuccessful"> * Donation successful! </label>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" class="form-control" [(ngModel)]="donator.name" placeholder="Name" [disabled]="!hasPinned">
        </div>
        <div class="form-group">
          <label>Last Name:</label>
          <input type="text" class="form-control" [(ngModel)]="donator.lastName" placeholder="Last name" [disabled]="!hasPinned">
        </div>
        <div class="form-group">
          <label>Contact Number:</label>
          <input type="text" class="form-control" [(ngModel)]="donator.contactNumber" placeholder="+xx xxx xxxx xxx" [disabled]="!hasPinned">
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="text" class="form-control" [(ngModel)]="donator.email" placeholder="example@donatenow.com" [disabled]="!hasPinned">
        </div>
        <div class="form-group">
          <label>Address:</label>
          <input type="text" class="form-control" [(ngModel)]="donator.address" placeholder="Roebling st. 62" [disabled]="!hasPinned">
        </div>
        <div class="form-group">
          <label>Blood Group:</label>
          <input type="text" class="form-control" [(ngModel)]="donator.bloodGroup" placeholder="Example: A+ | B- | AB- | O+" [disabled]="!hasPinned">
        </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal" (click)="toggleForm(); this.formError = false;" [disabled]="!hasPinned">Close</button>
          <button type="button" class="btn btn-primary" (click)="saveDonator()" [disabled]="!hasPinned">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  `,
  inputs: ['options', 'itemId']
})
export class MapComponent {
  donator: Donator;
  showingDonator: Donator;

  map: Map;
  options: Object;
  itemId: string;

  tb: Draw;
  markerSymbol: SimpleMarkerSymbol;
  currentEvent: any;

  hasPinned: Boolean = false;
  formError: Boolean = false;
  serverError: Boolean = false;
  displayForm: Boolean = false;
  submitSuccessful: Boolean = false;

  localCache: Donator[] = [];

  constructor(private elRef:ElementRef, private _mapService:MapService, private _donatorService:DonatorService) {
    this.donator = new Donator();
  }

  ngOnInit() {
    // create the map and toolbar
    this.markerSymbol = new SimpleMarkerSymbol();
    this.markerSymbol.setSize(25);
    this.markerSymbol.setPath(markerPath);
    this.markerSymbol.setColor(new Color(markerColor));
    this.map = this._mapService.initializeMap('mainMap', this.options);
    socket.on('event', (data) => {
      this.processSaving(data);
    });
    this.map.on('load', () => {
      this.initToolbar(this.map);
      this.map.graphics.on('click', (evt) => this.handleMapClick(evt));
      this.loadDonators();
    });
    this.map.on('extent-change', (evt) => this.mapExtentChange(evt));
  }

  //Show initial locations.
  showLocation(x, y) {
    var point = new Point(x, y, new SpatialReference({wkid:102100}));
    var graphic = new Graphic(point, this.markerSymbol);
    this.map.graphics.add(graphic);
  }

  processSaving(data: any) {
    for (let i = 0; i < this.localCache.length; i ++) {
      let current = this.localCache[i];
      if (current.xCoord === data.xCoord && current.yCoord === data.yCoord) return;
    }
    this.localCache.push(data);
    this.showLocation(data.xCoord, data.yCoord);
  }

  initToolbar(map: any) {
    let tb = new Draw(map);
    // After clicking, add point to map.
    tb.on('draw-complete', (evt) => this.initiatePointDrawing(evt, tb));
    on(dom.byId("info"), "click", function(evt) {
      if ( evt.target.id === "info" ) {
        return;
      }
      map.disableMapNavigation();
      tb.activate(Draw.POINT);
    });
  }

  mapExtentChange(evt) {
    let topRight = webMercatorUtils.xyToLngLat(evt.extent.xmax, evt.extent.ymax)
    let bottomLeft = webMercatorUtils.xyToLngLat(evt.extent.xmin, evt.extent.ymin)
    // c1^2 + c2^2 = getWidth() ^ 2, as it is a square, c1 = c2
    //=> 2 * c = getWidth() => c = getWidth() / 2
    let distance = evt.extent.getWidth() / 2;
    let topLeft = webMercatorUtils.xyToLngLat(evt.extent.xmax - distance, evt.extent.ymax - distance)
    let bottomRight = webMercatorUtils.xyToLngLat(evt.extent.xmin - distance, evt.extent.ymin - distance)
    // DO LOADING
    // this.loadDonators();
  }

  loadDonators() {
    // Gets donators into cache.
    this._donatorService.getDonators().then((response) => {
      for (let i = 0; i < response.length; i ++) {
        let current = response[i];
        this.localCache.push(current);
        this.showLocation(current.xCoord, current.yCoord);
      }
    });
  }

  handleMapClick(evt): void {
    this.displayForm = true;
    let x = evt.graphic.geometry.x;
    let y = evt.graphic.geometry.y;
    for (let i = 0; i < this.localCache.length; i ++) {
      let current = this.localCache[i];
      if (current.xCoord === x && current.yCoord === y) {
        this.showingDonator = Object.assign({}, current);
        break;
      }
    }
  }

  initiatePointDrawing(evt: any, tb: Draw) {
    tb.deactivate();
    this.map.enableMapNavigation();
    this.toggleForm();
    // Set current event
    this.currentEvent = evt;
  }

  toggleForm(){
    this.hasPinned = !this.hasPinned;
  }

  saveDonator() {
    if (this.donator.isValid()) {
      this.donator.xCoord = this.currentEvent.geometry.x;
      this.donator.yCoord = this.currentEvent.geometry.y;
      this.persistDonator();
      this.toggleForm();
    } else {
      this.formError = true;
    }
  }

  cacheDonator() {
    var _donatorCopy = Object.assign({}, this.donator);
    _donatorCopy.xCoord = this.currentEvent.geometry.x;
    _donatorCopy.yCoord = this.currentEvent.geometry.y;
    this.localCache.push(_donatorCopy);
  }

  persistDonator() {
    this._donatorService.createNewDonatorPoint(this.donator).then(resp => {
      if (resp === true){
        this.cacheDonator();
        this.formError = false;
        this.serverError = false;
        this.submitSuccessful = true;
      }else {
        this.serverError = true;
      }
    });

  }
}
