import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DocumentModel } from '@core/api/nuxeo/lib';

@Component({
  selector: 'tbwa-thumbnail-view-item',
  templateUrl: './thumbnail-view-item.component.html',
  styleUrls: ['./thumbnail-view-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbnailViewItemComponent {

  layout: string = 'default';

  @Input() styleClass: string;

  @Input() document: DocumentModel;

  @Input('layout')
  set _layout(name: string) {
    if (name) {
      this.layout = name;
    }
  }

  getThumbnailUrl(doc: DocumentModel): string {
    return doc.isAudio() && doc.type === 'App-Library-Audio' ? 'assets/images/no-thumbnail.png' : doc.thumbnailUrl;
  }
}

@Component({
  selector: 'tbwa-thumbnail-view',
  styleUrls: ['./thumbnail-view.component.scss'],
  template: `
  <div [nbSpinner]="loading" nbSpinnerStatus="disabled" class="{{styleClass}}" tabIndex="-1" [ngStyle]="loading ? {'min-height': '120px'} : {}">
    <div *ngFor="let document of documents" class="thumbnail-view">
      <tbwa-thumbnail-view-item [layout]="itemLayout" [document]="document" [styleClass]="styleClass" [tabIndex]="tabIndex"></tbwa-thumbnail-view-item>
    </div>
    <div *ngIf="showEmpty && documents && documents.length === 0" class="thumbnail-view">
      <span class="empty-data">No data found</span>
    </div>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbnailViewComponent implements OnInit {

  @Input() layout: string;

  @Input('loading')
  set _loading(loading: boolean) {
    this.loading = loading;
  }

  @Input() itemLayout: string;

  @Input() showEmpty: boolean = true;

  @Input() documents: DocumentModel[] = [];

  @Input() tabIndex: number = -1;

  loading: boolean;

  styleClass: string = 'quarter flex';

  private styleList = {
    'agency': 'quarter flex',
    'brand': 'half flex',
    'search-list': 'results',
    'search-results': 's-results flex',
    'backslash': 'backslash dates flex',
    'disruption': 'disruption quarter flex',
    'intelligence': 'intelligence quarter flex',
  };

  ngOnInit() {
    this.setStyleClass(this.layout);
  }

  private setStyleClass(layout) {
    this.styleClass = this.styleList[layout] || 'quarter flex';
  }
}
