import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { ListSearchRowCustomViewSettings } from '../list-search-form/list-search-form.interface';

@Component({
  template: `
    <ng-container *ngIf="value" [ngSwitch]="true">

      <ng-container *ngSwitchCase="options.viewType === 'thumbnail'">
        <img [attr.doc-uid]="value.uid" style="max-height:68px;" [src]="value.thumbnailUrl" (click)="onClick($event)" >
      </ng-container>

      <ng-container *ngSwitchCase="options.viewType === 'text'">
        <a href="javascript:;" (click)="onClick($event)" class="property-intro inline-top" title="getTitle(value)">{{getTitle(value)}}</a>
      </ng-container>

      <ng-container *ngSwitchCase="options.viewType === 'icon'">
        <img style="max-height:68px;" [src]="value.url">
      </ng-container>

      <ng-container *ngSwitchCase="options.viewType === 'html'">
        <div [attr.doc-uid]="value.uid"class="html-template" [innerHTML]="getHtmlTemplate(value)"></div>
      </ng-container>

      <ng-container *ngSwitchCase="options.viewType === 'usage-rights-expiry'">
        <ng-container *ngSwitchCase="value.all_error_messages && value.all_error_messages.length > 0">
          <ul class="state error">
            <li><span>{{value.error_messages}}</span></li>
          </ul>
        </ng-container>
        <ng-container *ngSwitchCase="value.info_messages && value.info_messages.length > 0">
          <ul class="state info">
            <li><span>{{value.info_messages}}</span></li>
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

  @Input() value: any;

  @Input()
  set settings(settings: ListSearchRowCustomViewSettings) {
    if (!isValueEmpty(settings)) {
      this.options = settings;
    }
  }

  constructor(protected documentPageService: DocumentPageService) {
  }

  getTitle(doc: DocumentModel): string {
    return this.options.dialogTitle.replace(':docTitle', doc.title);
  }

  getHtmlTemplate(doc: DocumentModel): string {
    return this.options.htmlFn(doc);
  }

  onClick(event: Event): void {
    if (this.options.enableDialog) {
      this.documentPageService.triggerEvent(new GlobalEvent({ name: 'ItemClicked', data: { document: this.value }, type: 'list-search-row-custom-view' }));
    }
  }

}
