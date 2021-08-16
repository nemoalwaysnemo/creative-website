import { Component, Input, TemplateRef, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';
import { isValueEmpty } from '@core/services/helpers';
import { SelectableItemSettings } from '../document-selectable';
import { BehaviorSubject, combineLatest, Subject, Subscription } from 'rxjs';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { DocumentThumbnailViewSettings } from './document-thumbnail-view.interface';
import { animate, style, transition, trigger, state, stagger, query } from '@angular/animations';

@Component({
  selector: 'document-thumbnail-view',
  styleUrls: ['./document-thumbnail-view.component.scss'],
  animations: [
    trigger('stagger', [
      transition('* => true', [
        query(':enter', [
          style({opacity: 0, transform: 'translateX(-500px)'}),
          stagger(100, [
            animate('200ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
  template: `
    <div [nbSpinner]="loading" nbSpinnerStatus="disabled" tabIndex="-1" [ngStyle]="loading ? viewSettings.loadingStyle : {}">
        <ng-container *ngIf="documentList && documentList.length !== 0">
          <div [@stagger]="enableAnimation" class="s-results {{viewSettings.layout}}" [ngStyle]="hide ? {'display': 'none'} : {}">
            <div class="thumbnail-view-custom-item" *ngIf="viewSettings.enableCustomGrid">
              <div [ngClass]="['custom-grid', (viewSettings.disableCustomGrid ? 'disable' : '')]" title="{{viewSettings.customGridTitle}}" (click)="onCustomGridClick($event)">
                <div class="custom-add"><h1>+</h1></div>
              </div>
              <div class="description"><h1 title="{{viewSettings.customGridTitle}}">{{viewSettings.customGridTitle}}</h1></div>
            </div>
            <div *ngFor="let document of documentList; let i=index" [selectable]="document" [settings]="selectableItemSettings" [selectableCheckboxStyle]="selectableCheckboxStyle" [ngClass]="['thumbnail-view-item', sliderClass, (selectClass ? selectClass : '')]" [attr.doc-uid]="document.uid" [attr.doc-type]="document.type">
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
export class DocumentThumbnailViewComponent implements OnInit, OnDestroy, AfterViewInit {

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

  constructor(private documentPageService: DocumentPageService) {
    this.subscribeEvents();
  }

  sliderClass: string = '';

  documentList: DocumentModel[] = [];

  selectClass: string = '';

  selectableCheckboxStyle: string;

  viewSettings: DocumentThumbnailViewSettings = new DocumentThumbnailViewSettings();

  selectableItemSettings: SelectableItemSettings = new SelectableItemSettings();

  @Input() templateRef: TemplateRef<any>;

  @Input() loading: boolean = false;

  @Input() hide: boolean = false;

  private documents$: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

  private viewSettings$: Subject<DocumentThumbnailViewSettings> = new Subject<DocumentThumbnailViewSettings>();

  private subscription: Subscription = new Subscription();

  @Input() enableAnimation: boolean = false;

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent): void {
    if (this.selectableItemSettings.allowShiftMultiSelect) {
      if (event.key === 'Shift') {
        this.selectClass = 'enableSelectable';
        this.selectableCheckboxStyle = 'item-selectable-checkbox-block';

      } else {
        this.selectClass = '';
        this.selectableCheckboxStyle = 'item-selectable-checkbox-hide';
      }
    }
  }

  @HostListener('window:up', ['$event'])
  keyUpEvent(event: KeyboardEvent): void {
    if (this.selectableItemSettings.allowShiftMultiSelect) {
      if (event.key === 'Shift') {
        this.selectClass = '';
        this.selectableCheckboxStyle = 'item-selectable-checkbox-hide';
      }
    } else if (this.selectableItemSettings.enableSelectable) {
      this.selectClass = 'enableSelectable';
    }
  }

  ngOnInit(): void {
    this.selectableCheckboxShow();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private selectableCheckboxShow(): void {
    if (this.selectableItemSettings.enableSelectable) {
      if (!this.selectableItemSettings.allowShiftMultiSelect) {
        this.selectClass = 'enableSelectable';
        this.selectableCheckboxStyle = 'item-selectable-checkbox-block';
      } else {
        this.selectClass = '';
        this.selectableCheckboxStyle = 'item-selectable-checkbox-hide';
      }
    }
  }

  ngAfterViewInit(): void {
  }

  onCustomGridClick(event: any): void {
    if (!this.viewSettings.disableCustomGrid) {
      this.documentPageService.triggerEvent(new GlobalEvent({ name: 'CustomGridClick', type: 'document-thumbnail-view' }));
    }
  }

  private performSettings(settings: DocumentThumbnailViewSettings): void {
    this.viewSettings = settings;
  }

  private subscribeEvents(): void {
    const subscription1 = this.documentPageService.onEventType('document-thumbnail-view').subscribe((e: GlobalEvent) => {
      if (e.name === 'SliderValueChanged') {
        this.sliderClass = e.payload.value === 1 ? (e.payload.className || 'half-size') : (e.payload.className || '');
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
