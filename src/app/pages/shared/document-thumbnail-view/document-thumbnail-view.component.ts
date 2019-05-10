import { Component, Input, OnInit, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';

@Component({
  selector: 'document-thumbnail-view',
  styleUrls: ['./document-thumbnail-view.component.scss'],
  template: `
  <div [nbSpinner]="loading" nbSpinnerStatus="disabled" tabIndex="-1" [ngStyle]="loading ? {'min-height': '120px'} : {}">
    <ng-container *ngIf="documentList && documentList.length !== 0">
      <div class="s-results {{layout}}">
        <div *ngFor="let document of documentList" class="thumbnail-view-item">
          <ng-template #itemTpl [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="{doc: document}"></ng-template>
        </div>
        <div class="clear"></div>
        <ng-container *ngIf="emptyList && emptyList.length !== 0">
          <div class="empty-thumbnail-view-item"></div>
        </ng-container>
      </div>
    </ng-container>
    <div *ngIf="!hideEmpty && !loading && documentList && documentList.length === 0" class="thumbnail-view empty text-center">
      <span class="empty-data">No data found</span>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentThumbnailViewComponent implements OnInit {

  documentList: DocumentModel[] = [];

  emptyList: any[] = [];

  @Input() layout: 'half' | 'third' | 'quarter' | 'suggestion-inline' = 'quarter';

  @Input() hideEmpty: boolean = false;

  @Input() loading: boolean;

  @Input() templateRef: TemplateRef<any>;

  @Input()
  set documents(docs: DocumentModel[]) {
    if (docs && docs.length > 0) {
      this.documentList = docs;
      this.emptyList = this.fillForQuarter(docs);
    }
  }

  ngOnInit(): void {

  }

  private fillForQuarter(docs: DocumentModel[]): any[] {
    const list: any[] = [];
    if (this.layout === 'quarter' && docs.length % 4 > 0) {
      const number = 4 - (docs.length % 4);
      for (let index = 0; index < number; index++) {
        list.push({});
      }
    }
    return list;
  }

}
