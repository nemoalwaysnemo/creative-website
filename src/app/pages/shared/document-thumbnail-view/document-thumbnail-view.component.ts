import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';

@Component({
  selector: 'document-thumbnail-view',
  styleUrls: ['./document-thumbnail-view.component.scss'],
  template: `
  <div [nbSpinner]="loading" nbSpinnerStatus="disabled" tabIndex="-1" [ngStyle]="loading ? {'min-height': '120px'} : {}">
    <ng-container *ngIf="documentList && documentList.length !== 0">
      <div class="s-results {{layout}}">
        <div *ngFor="let document of documentList; let i=index" class="thumbnail-view-item">
          <ng-template #itemTpl [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="{doc: document}"></ng-template>
        </div>
        <div class="clear"></div>
      </div>
    </ng-container>
    <div *ngIf="!hideEmpty && !loading && documentList && documentList.length === 0" class="thumbnail-view empty text-center">
      <span class="empty-data">{{noResultText}}</span>
    </div>
  </div>
  `,
})
export class DocumentThumbnailViewComponent implements OnInit {

  documentList: DocumentModel[] = [];

  @Input() layout: string = 'quarter'; // 'half' | 'third' | 'quarter' | 'suggestion-inline';

  @Input() hideEmpty: boolean = false;

  @Input() loading: boolean;

  @Input() templateRef: TemplateRef<any>;

  @Input() noResultText: string = 'No data found';

  @Input()
  set documents(docs: DocumentModel[]) {
    this.documentList = docs;
  }

  constructor() {

  }

  ngOnInit() {

  }
}
