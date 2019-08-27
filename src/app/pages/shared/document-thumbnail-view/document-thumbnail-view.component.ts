import { Component, Input, TemplateRef, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';
import { DocumentViewService } from '@pages/shared/services/document-view.service';
@Component({
  selector: 'document-thumbnail-view',
  styleUrls: ['./document-thumbnail-view.component.scss'],
  template: `
  <div [nbSpinner]="loading" nbSpinnerStatus="disabled" tabIndex="-1" [ngStyle]="loading ? {'min-height': '120px'} : {}">
    <ng-container *ngIf="documentList && documentList.length !== 0">
      <div class="s-results {{layout}}">
        <div *ngFor="let document of documentList; let i=index" class="thumbnail-view-item">
          <div id="scroll-anchor-{{i}}">
            <ng-template #itemTpl [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="{doc: document}"></ng-template>
          </div>
        </div>
        <div class="clear"></div>
        <ng-container *ngIf="emptyList && emptyList.length !== 0">
          <div class="empty-thumbnail-view-item"></div>
        </ng-container>
      </div>
    </ng-container>
    <div *ngIf="!hideEmpty && !loading && documentList && documentList.length === 0" class="thumbnail-view empty text-center">
      <span *ngIf="!viewType" class="empty-data">No data found</span>
      <span *ngIf="viewType && viewType!='agency' && viewType!='brand'" class="empty-data">No related {{viewType}} found</span>
      <span *ngIf="viewType=='agency' || viewType=='brand'" class="empty-data">No text at all</span>
    </div>
  </div>
  `,
})
export class DocumentThumbnailViewComponent implements OnInit {

  constructor(private documentViewService: DocumentViewService) { }
  documentList: DocumentModel[] = [];

  emptyList: any[] = [];

  @Input() layout: 'half' | 'third' | 'quarter' | 'suggestion-inline' = 'quarter';

  @Input() hideEmpty: boolean = false;

  @Input() loading: boolean;

  @Input() templateRef: TemplateRef<any>;

  @Input() viewType: string = '';

  @Input()
  set documents(docs: DocumentModel[]) {
    this.documentList = docs;
    this.emptyList = this.fillForQuarter(docs);
  }

  ngOnInit() {
    this.documentViewService.onDeletedDoc()
      .subscribe((res) => {
        this.documentList = this.documentList.filter(function (el) { return el.uid !== res.uid; });
      });
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
