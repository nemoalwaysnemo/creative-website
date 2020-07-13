import { Component, Input, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';
import { Subscription } from 'rxjs';
import { SelectableItemSettings } from '../selectable-item/selectable-item.interface';
import { DocumentThumbnailViewService, DocumentThumbnailViewEvent } from './document-thumbnail-view.service';

@Component({
  selector: 'document-thumbnail-view',
  styleUrls: ['./document-thumbnail-view.component.scss'],
  template: `
    <div [nbSpinner]="loading" nbSpinnerStatus="disabled" tabIndex="-1" [ngStyle]="loading ? loadingStyle : {}">
      <ng-container *ngIf="documentList && documentList.length !== 0">
        <div class="s-results {{layout}}" [ngStyle]="hidde ? {'display': 'none'} : {'display': 'block'}">
          <div *ngFor="let document of documentList; let i=index" [selectable]="document" [settings]="selectableItemSettings" [ngClass]="['thumbnail-view-item', sliderClass]">
            <ng-template #itemTemplate [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="{doc: document}"></ng-template>
          </div>
          <div class="clear"></div>
        </div>
      </ng-container>
      <ng-container *ngIf="!hideEmpty && !loading && documentList && documentList.length === 0">
        <div class="thumbnail-view empty text-center">
          <span class="empty-data">{{noResultText}}</span>
        </div>
      </ng-container>
    </div>
  `,
})
export class DocumentThumbnailViewComponent implements OnInit, OnDestroy {

  documentList: DocumentModel[] = [];

  sliderClass: string = '';

  selectableItemSettings: SelectableItemSettings;

  @Input() layout: string = 'quarter'; // 'half' | 'third' | 'quarter' | 'suggestion-inline';

  @Input() loadingStyle: any = { 'min-height': '120px' };

  @Input() hideEmpty: boolean = false;

  @Input() loading: boolean = false;

  @Input() hidde: boolean = false;

  @Input() templateRef: TemplateRef<any>;

  @Input() noResultText: string = 'No data found';

  @Input()
  set selectableSettings(settings: SelectableItemSettings) {
    this.selectableItemSettings = (settings || new SelectableItemSettings());
  }

  @Input()
  set documents(docs: DocumentModel[]) {
    this.documentList = docs;
  }

  private subscription: Subscription = new Subscription();

  constructor(private thumbnailViewService: DocumentThumbnailViewService) {
    this.subscribeEvents();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected subscribeEvents(): void {
    this.subscription = this.thumbnailViewService.onEvent('SliderValueChanged').subscribe((e: DocumentThumbnailViewEvent) => {
      if (e.payload.value === 1) {
        this.sliderClass = e.payload.className || 'half-size';
      } else {
        this.sliderClass = e.payload.className || '';
      }
    });
  }

}
