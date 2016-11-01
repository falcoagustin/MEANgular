import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'user-information',
  template: `
  <div *ngIf="display && information" class="my-modal-dialog" [class.opacity]="hasPinned" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="myModalLabel"> Donator Info</h4>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Donator: {{information.name}} {{information.lastName}}</label>
        </div>
        <div class="form-group">
          <label>Address: {{information.address}} </label>
        </div>
        <div class="form-group">
          <label>Blood group: {{information.bloodGroup}} </label>
        </div>
        <div class="form-group">
          <a  class="clickable" (click)="toggleInformation()"> Click for email & phone</a>
          <div [hidden]="!showHiddenInfo">
            <label>Email: {{information.email}} </label>
            <label>Phone: {{information.contactNumber}} </label>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})

export class UserInformationComponent implements OnInit {
  @Input()
  display: Boolean;

  @Input()
  information: any;

  showHiddenInfo: Boolean = false;

  ngOnInit(): void {}

  toggleInformation(): void {
    this.showHiddenInfo = !this.showHiddenInfo;
  }
}
