import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentModel } from '@core/api/nuxeo/lib';

@Component({
  selector: 'tbwa-thumbnail-view-item',
  templateUrl: './thumbnail-view-item.component.html',
  styleUrls: ['./thumbnail-view-item.component.scss'],
})
export class ThumbnailViewItemComponent implements OnInit {

  layout: string = 'default';

  @Input() styleClass: string;

  @Input() document: DocumentModel;

  @Input('layout')
  set _layout(name: string) {
    if (name) {
      this.layout = name;
    }
  }

  ngOnInit() {
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
  </div>
  `,
})
export class ThumbnailViewComponent implements OnInit {

  @Input() layout: string;

  @Input('loading')
  set _loading(loading: boolean) {
    this.loading = loading;
  }

  @Input() itemLayout: string;

  @Input() documents: Observable<DocumentModel[]>;

  @Input() tabIndex: number = -1;

  loading: boolean;

  styleClass: string = 'quarter flex';
  styleList = {
    'agency': 'quarter flex',
    'brand': 'half flex',
    'search-list': 'results',
    'search-results': 's-results flex',
    'backslash': 'dates flex',
    'distruption': 'quarter flex',
  };

  constructor() {

  }

  ngOnInit() {
    this.setStyleClass(this.layout);
  }

  private setStyleClass(layout) {
    this.styleClass = this.styleList[layout] || 'quarter flex';
  }
}
