import { Component, Input, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';
import { isValueEmpty } from '@core/services/helpers';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { SelectableItemSettings } from '../document-selectable';
import { DocumentThumbnailViewSettings } from './document-thumbnail-view.interface';
import { DocumentThumbnailViewService, DocumentThumbnailViewEvent } from './document-thumbnail-view.service';

@Component({
  selector: 'document-thumbnail-view',
  styleUrls: ['./document-thumbnail-view.component.scss'],
  template: `
    <div [nbSpinner]="loading" nbSpinnerStatus="disabled" tabIndex="-1" [ngStyle]="loading ? viewSettings.loadingStyle : {}">
      <ng-container *ngIf="documentList && documentList.length !== 0">
        <div class="s-results {{viewSettings.layout}}" [ngStyle]="hide ? {'display': 'none'} : {}">
          <div class="custom-grid" *ngIf="viewSettings.enableCustomGrid">
              <div class="image-holder">
              </div>
              <div class="description">
              </div>
          </div>
          <div *ngFor="let document of documentList; let i=index" [selectable]="document" [settings]="selectableItemSettings" [ngClass]="['thumbnail-view-item', sliderClass, (selectableItemSettings.enableSelectable ? 'enableSelectable' : '')]" [attr.doc-uid]="document.uid" [attr.doc-type]="document.type">
            <ng-template #itemTemplate [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="{doc: document}"></ng-template>
          </div>
          <div class="clear"></div>
        </div>
      </ng-container>
      <ng-container *ngIf="!viewSettings.hideEmpty && !loading && documentList && documentList.length === 0">
        <div class="thumbnail-view empty text-center">
          <span class="empty-data">{{viewSettings.noResultText}}</span>
        </div>
      </ng-container>
    </div>
  `,
})
export class DocumentThumbnailViewComponent implements OnInit, OnDestroy {

  sliderClass: string = '';

  documentList: DocumentModel[] = [];

  viewSettings: DocumentThumbnailViewSettings = new DocumentThumbnailViewSettings();

  selectableItemSettings: SelectableItemSettings = new SelectableItemSettings();

  @Input() templateRef: TemplateRef<any>;

  @Input() loading: boolean = false;

  @Input() hide: boolean = false;

  @Input()
  set selectableSettings(settings: SelectableItemSettings) {
    this.selectableItemSettings = (settings || new SelectableItemSettings());
  }

  @Input()
  set documents(docs: DocumentModel[]) {
    if (!isValueEmpty(docs)) {
      this.documents$.next(docs);
    }
  }

  @Input()
  set settings(settings: DocumentThumbnailViewSettings) {
    if (!isValueEmpty(settings)) {
      this.viewSettings$.next(settings);
    }
  }

  protected documents$: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

  private viewSettings$: Subject<DocumentThumbnailViewSettings> = new Subject<DocumentThumbnailViewSettings>();

  private subscription: Subscription = new Subscription();

  constructor(private thumbnailViewService: DocumentThumbnailViewService) {
    this.subscribeEvents();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private performSettings(settings: DocumentThumbnailViewSettings): void {
    this.viewSettings = settings;
  }

  protected subscribeEvents(): void {
    const subscription1 = this.thumbnailViewService.onEvent('SliderValueChanged').subscribe((e: DocumentThumbnailViewEvent) => {
      if (e.payload.value === 1) {
        this.sliderClass = e.payload.className || 'half-size';
      } else {
        this.sliderClass = e.payload.className || '';
      }
    });
    this.subscription.add(subscription1);
    const subscription2 = combineLatest([
      this.documents$,
      this.viewSettings$,
    ]).subscribe(([docs, settings]: [DocumentModel[], DocumentThumbnailViewSettings]) => {
      this.documentList = docs;
      this.performSettings(settings);
    });
    this.subscription.add(subscription2);
  }

}
