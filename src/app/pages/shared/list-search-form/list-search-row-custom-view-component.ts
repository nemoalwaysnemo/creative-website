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

      <ng-container *ngSwitchCase="options.viewType === 'usage-rights-expiry'">
        <ng-container *ngSwitchCase="value.all_error_messages && value.all_error_messages.length > 0">
          <ul class="state error">
            <li>
              <span>{{value.error_messages}}</span>
            </li>
          </ul>
        </ng-container>
        <ng-container *ngSwitchCase="value.info_messages && value.info_messages.length > 0">
          <ul class="state info">
            <li>
              <span>{{value.info_messages}}</span>
            </li>
          </ul>
        </ng-container>
        <ng-container *ngSwitchCase="value.info_messages && value.info_messages.length === 0 && value.info_messages.length === value.all_error_messages.length">
          <ul class="state">
            <li>
              <h4>Expires in</h4>
              <span>{{value.days_left}} days</span>
            </li>
            <li>
              <h4>Expires on</h4>
              <span>{{value.end_date ? (value.end_date | date:'MMM d, yyyy':'UTC') : 'N/A'}}</span>
            </li>
          </ul>
        </ng-container>
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
