import { Component, Input, TemplateRef, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';
import { isValueEmpty } from '@core/services/helpers';
import Shuffle from 'shufflejs';
import { SelectableItemSettings } from '../document-selectable';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { DocumentThumbnailViewSettings } from './document-thumbnail-view.interface';

@Component({
  selector: 'document-thumbnail-view',
  styleUrls: ['./document-thumbnail-view.component.scss'],
  template: `
   <!-- <button (click)="shuffle()">Shuffle</button>-->
    <div [nbSpinner]="loading" nbSpinnerStatus="disabled" tabIndex="-1" [ngStyle]="loading ? viewSettings.loadingStyle : {}">
      <div #shuffleContainer class="shuffle-container">
        <ng-container *ngIf="documentList && documentList.length !== 0">
          <div class="s-results {{viewSettings.layout}}" [ngStyle]="hide ? {'display': 'none'} : {}">
            <div class="thumbnail-view-custom-item" *ngIf="viewSettings.enableCustomGrid">
                <div [ngClass]="['custom-grid', (viewSettings.disableCustomGrid ? 'disable' : '')]" title="{{viewSettings.customGridTitle}}" (click)="onCustomGridClick($event)"></div>
            </div>
            <div *ngFor="let document of documentList; let i=index" [selectable]="document" [settings]="selectableItemSettings" [ngClass]="['thumbnail-view-item', sliderClass, (selectableItemSettings.enableSelectable ? 'enableSelectable' : '')]" [attr.doc-uid]="document.uid" [attr.doc-type]="document.type">
              <ng-template #itemTemplate [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="{doc: document}"></ng-template>
            </div>
            <div class="clear"></div>
          </div>
        </ng-container>
        <div #shuffleSizer class="sizer-element"></div>
      </div>
      <ng-container *ngIf="!viewSettings.hideEmpty && !loading && documentList && documentList.length === 0">
        <div class="thumbnail-view empty text-center">
          <span class="empty-data">{{viewSettings.noResultText}}</span>
        </div>
      </ng-container>
    </div>
  `,
})
export class DocumentThumbnailViewComponent implements OnInit, OnDestroy, AfterViewInit {

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

  @ViewChild('shuffleContainer') private shuffleContainer: ElementRef;

  @ViewChild('shuffleSizer') private shuffleSizer: ElementRef;

  private documents$: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

  private viewSettings$: Subject<DocumentThumbnailViewSettings> = new Subject<DocumentThumbnailViewSettings>();

  private shuffleInstance: Shuffle;

  private subscription: Subscription = new Subscription();

  constructor(private documentPageService: DocumentPageService) {
    this.subscribeEvents();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (this.viewSettings.enableShuffle) {
      this.shuffle();
    }
  }

  shuffle(): void {
    this.getShuffleInstance().filter();
  }

  onCustomGridClick(event: any): void {
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'CustomGridClick', type: 'document-thumbnail-view' }));
  }

  private performSettings(settings: DocumentThumbnailViewSettings): void {
    this.viewSettings = settings;
  }

  private getShuffleInstance(): Shuffle {
    if (!this.shuffleInstance) {
      const options = Object.assign({}, this.viewSettings.shuffleOptions || {}, {
        sizer: this.shuffleSizer.nativeElement,
        itemSelector: '.thumbnail-view-item',
      });
      this.shuffleInstance = new Shuffle(this.shuffleContainer.nativeElement, options);
    }
    return this.shuffleInstance;
  }

  private subscribeEvents(): void {
    const subscription1 = this.documentPageService.onEventType('document-thumbnail-view').subscribe((e: GlobalEvent) => {
      if (e.name === 'SliderValueChanged') {
        this.sliderClass = e.payload.value === 1 ? (e.payload.className || 'half-size') : (e.payload.className || '');
      } else if (e.name === 'ShuffleDocumentItems') {
        this.shuffle();
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
