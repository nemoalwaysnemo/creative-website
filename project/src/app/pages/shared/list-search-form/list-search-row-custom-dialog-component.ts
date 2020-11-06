import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DocumentModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentDialogEvent, GlobalDocumentDialogService } from '../global-document-dialog';
import { ListSearchRowCustomViewSettings } from './list-search-form.interface';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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

        <ng-container *ngIf="options.dialogSettings">
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
export class ListSearchRowCustomDialogComponent implements OnInit, OnDestroy {

  options: ListSearchRowCustomViewSettings;

  dialogParams$: Subject<any>;

  private subscription: Subscription = new Subscription();

  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;

  @Input() value: DocumentModel;

  @Input()
  set settings(settings: ListSearchRowCustomViewSettings) {
    if (!isValueEmpty(settings)) {
      this.options = settings;
    }
  }

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService) {
  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getTitle(doc: DocumentModel): string {
    return this.options.dialogTitle.replace(':docTitle', doc.title);
  }

  openDialog(dialog: TemplateRef<any>, opts: any = {}): void {
    if (this.options.enableClick) {
      const options = Object.assign({}, { closeOnBackdropClick: false }, opts);
      this.globalDocumentDialogService.open(dialog, options);
    }
  }

  private triggerDialog(event: DocumentDialogEvent): void {
    if (event.name === 'ButtonClicked') {
      this.openDialog(this.dialog, { selectedMenu: event.options.selectedMenu, selectedTab: event.options.selectedTab });
    }
  }

  private subscribeEvents(): void {
    const subscription = this.globalDocumentDialogService.onEventType('custom').pipe(
      filter((params: any) => params.options.document && this.value.uid === params.options.document.uid),
    ).subscribe((event: DocumentDialogEvent) => {
      this.triggerDialog(event);
    });
    this.subscription.add(subscription);
  }
}
