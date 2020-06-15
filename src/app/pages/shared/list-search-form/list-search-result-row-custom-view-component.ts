import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { objHasValue } from '@core/services/helpers';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { GlobalDocumentDialogSettings } from '../global-document-dialog/global-document-dialog.interface';

export class ListSearchResultRowCustomViewSettings {

  dialogTitle: string = ':docTitle';

  enableClick: boolean = true;

  viewType: 'button' | 'thumbnail' = 'button';

  dialogSettings: GlobalDocumentDialogSettings;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Component({
  template: `
    <ng-container *ngIf="value" [ngSwitch]="true">
      <ng-container *ngSwitchCase="options.viewType === 'button'">
        <button type="button" (click)="openDialog(dialog)" class="icon_btn">Detail</button>
        <ng-template #dialog>
          <global-document-dialog [settings]="options.dialogSettings" [documentModel]="value" [title]="getTitle(value)"></global-document-dialog>
        </ng-template>
      </ng-container>
      <ng-container *ngSwitchCase="options.viewType === 'thumbnail'">
        <ng-container *ngIf="!options.dialogSettings" >
          <img style="max-height:100px;" [src]="value.thumbnailUrl">
        </ng-container>
        <ng-container *ngIf="options.dialogSettings" >
          <a href="javascript:;" (click)="openDialog(dialog)" class="property-intro inline-top" title="getTitle(value)">
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
export class ListSearchResultRowCustomViewComponent {

  options: ListSearchResultRowCustomViewSettings;

  @Input() value: DocumentModel;

  @Input()
  set settings(settings: ListSearchResultRowCustomViewSettings) {
    if (objHasValue(settings)) {
      this.options = settings;
    }
  }

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService) {

  }

  getTitle(doc: DocumentModel): string {
    return this.options.dialogTitle.replace(':docTitle', doc.title);
  }

  openDialog(dialog: TemplateRef<any>): void {
    if (this.options.enableClick) {
      this.globalDocumentDialogService.open(dialog);
    }
  }
}
