import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { DocumentModel } from '@core/api';
import { objHasValue } from '@core/services/helpers';
import { GlobalDocumentDialogService } from '../global-document-dialog';
import { ListSearchRowCustomViewSettings } from '../list-search-form/list-search-form.interface';
import { Subject, Observable } from 'rxjs';

@Component({
  template: `
    <ng-container *ngIf="value" [ngSwitch]="true">

      <ng-container *ngSwitchCase="options.viewType === 'button'">
        <button type="button" (click)="openDialog()" class="icon_btn">Detail</button>
        <ng-template #dialog>
          <global-document-dialog [settings]="options.dialogSettings" [documentModel]="value" [title]="getTitle(value)"></global-document-dialog>
        </ng-template>
      </ng-container>

      <ng-container *ngSwitchCase="options.viewType === 'thumbnail'">

        <ng-container *ngIf="!options.dialogSettings" >
          <img style="max-height:100px;" [src]="value.thumbnailUrl">
        </ng-container>

        <ng-container *ngIf="options.dialogSettings">
          <a href="javascript:;" (click)="openDialog()" class="property-intro inline-top" title="getTitle(value)">
            <div [ngStyle]="{'background-image': 'url('+value.thumbnailUrl+')'}"></div>
          </a>
          <ng-template #dialog>
            <global-document-dialog [settings]="options.dialogSettings" [documentModel]="value" [title]="getTitle(value)"></global-document-dialog>
          </ng-template>
        </ng-container>

      </ng-container>

    </ng-container>
  `,
})
export class ListSearchRowCustomDialogComponent {

  options: ListSearchRowCustomViewSettings;

  dialogParams$: Subject<any>;

  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;

  @Input() value: DocumentModel;

  @Input()
  set settings(settings: ListSearchRowCustomViewSettings) {
    if (objHasValue(settings)) {
      this.options = settings;
    }
  }

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService) {

  }

  getTitle(doc: DocumentModel): string {
    return this.options.dialogTitle.replace(':docTitle', doc.title);
  }

  openDialog(params: { page: number, tab: number } = { page: 0, tab: 0 }): void {
    if (this.options.enableClick) {
      this.globalDocumentDialogService.open(this.dialog, {}, params);
    }
  }
}
