import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { objHasValue } from '@core/services/helpers';
import { ListSearchRowCustomViewSettings } from './list-search-form.interface';

@Component({
  template: `
    <ng-container *ngIf="value" [ngSwitch]="true">

      <ng-container *ngSwitchCase="options.viewType === 'thumbnail'">
        <img style="max-height:100px;" [src]="value.thumbnailUrl">
      </ng-container>

      </ng-container>
  `,
})
export class ListSearchRowCustomViewComponent {

  options: ListSearchRowCustomViewSettings;

  @Input() value: DocumentModel;

  @Input()
  set settings(settings: ListSearchRowCustomViewSettings) {
    if (objHasValue(settings)) {
      this.options = settings;
    }
  }

  getTitle(doc: DocumentModel): string {
    return this.options.dialogTitle.replace(':docTitle', doc.title);
  }

}
