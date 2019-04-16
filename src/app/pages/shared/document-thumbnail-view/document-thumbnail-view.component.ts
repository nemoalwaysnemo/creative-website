import { Component, Input, OnInit, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';

@Component({
  selector: 'document-thumbnail-view',
  styleUrls: ['./document-thumbnail-view.component.scss'],
  template: `
  <div [nbSpinner]="loading" nbSpinnerStatus="disabled" tabIndex="-1" [ngStyle]="loading ? {'min-height': '120px'} : {}">
    <ng-container *ngIf="documents && documents.length !== 0">
      <div *ngFor="let document of documents" class="thumbnail-view-item">
        <ng-template #itemTpl [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="{doc: document}"></ng-template>
      </div>
    </ng-container>
    <div *ngIf="!loading && documents && documents.length === 0" class="thumbnail-view empty text-center">
      <span class="empty-data">No data found</span>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentThumbnailViewComponent implements OnInit {

  @Input() loading: boolean;

  @Input() templateRef: TemplateRef<any>;

  @Input() documents: DocumentModel[] = [];

  ngOnInit(): void {

  }

}