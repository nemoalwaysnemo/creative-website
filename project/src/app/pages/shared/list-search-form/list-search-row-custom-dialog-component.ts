import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentDialogEvent, GlobalDocumentDialogService } from '../global-document-dialog';
import { ListSearchRowCustomViewSettings } from './list-search-form.interface';
import { of as observableOf, combineLatest, Subject, Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  template: `
    <ng-container *ngIf="document" [ngSwitch]="true">

      <ng-container *ngSwitchCase="options.viewType === 'button'">
        <button type="button" (click)="openDialog(dialog)" class="icon_btn">{{options.placeholder}}</button>
      </ng-container>

      <ng-container *ngSwitchCase="options.viewType === 'html'">
        <div class="html-template" [innerHTML]="getHtmlTemplate(document)"></div>
      </ng-container>

      <ng-container *ngSwitchCase="options.viewType === 'download-action'">

        <ng-container *ngIf="downloadPermission$ | async">
          <a *ngIf="document.filePath" href="{{document.filePath}}" title="Download">
            <img style="max-height:68px;" src="/assets/images/download.png">
          </a>
        </ng-container>

        <ng-container *ngIf="enableDownloadRequest && (downloadPermission$ | async) === false">
          <a href="javascript:;" (click)="openDialog(dialog)" title="Download Request">
            <img style="max-height:68px;" src="/assets/images/download.png">
          </a>
        </ng-container>

      </ng-container>

      <ng-container *ngSwitchCase="options.viewType === 'thumbnail'">
        <ng-container *ngIf="!options.dialogSettings" >
          <img style="max-height:68px;" [src]="document.thumbnailUrl">
        </ng-container>

        <ng-container *ngIf="options.dialogSettings">
          <a href="javascript:;" (click)="openDialog(dialog)" class="property-intro inline-top" title="getTitle(document)">
            <img style="max-height:68px;" [src]="document.thumbnailUrl">
          </a>
        </ng-container>
      </ng-container>

      <ng-template #dialog>
        <global-document-dialog [settings]="options.dialogSettings" [documentModel]="document" [title]="getTitle(document)"></global-document-dialog>
      </ng-template>

    </ng-container>
  `,
})
export class ListSearchRowCustomDialogComponent implements OnInit, OnDestroy {

  downloadPermission$: Observable<boolean> = observableOf(false);

  options: ListSearchRowCustomViewSettings;

  document: DocumentModel;

  dialogParams$: Subject<any>;

  enableDownloadRequest: boolean = false;

  private subscription: Subscription = new Subscription();

  @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;

  @Input()
  set value(doc: DocumentModel) {
    if (doc) {
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: ListSearchRowCustomViewSettings) {
    if (!isValueEmpty(settings)) {
      this.settings$.next(settings);
    }
  }

  protected settings$: Subject<ListSearchRowCustomViewSettings> = new Subject<ListSearchRowCustomViewSettings>();

  protected document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService) {
    this.onDocumentChanged();
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

  getHtmlTemplate(doc: DocumentModel): string {
    return this.options.htmlFn(doc);
  }

  private triggerDialog(event: DocumentDialogEvent): void {
    if (event.name === 'ButtonClicked') {
      this.openDialog(this.dialog, { selectedMenu: event.options.selectedMenu, selectedTab: event.options.selectedTab });
    }
  }

  private performSettings(settings: any, doc: DocumentModel): void {
    this.options = settings;
    if (settings.enableDownloadRequest) {
      this.enableDownloadRequest = settings.downloadRequestFn(doc);
      this.downloadPermission$ = observableOf(doc.get('app_global:asset_request') === false);
    } else {
      this.downloadPermission$ = doc.hasPermission(NuxeoPermission.Write);
    }
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.settings$,
    ]).subscribe(([doc, settings]: [DocumentModel, ListSearchRowCustomViewSettings]) => {
      this.document = doc;
      this.performSettings(settings, doc);
    });
    this.subscription.add(subscription);
  }

  private subscribeEvents(): void {
    const subscription = this.globalDocumentDialogService.onEventType('custom').pipe(
      filter((params: any) => params.options.document && this.document.uid === params.options.document.uid),
    ).subscribe((event: DocumentDialogEvent) => {
      this.triggerDialog(event);
    });
    this.subscription.add(subscription);
  }
}
