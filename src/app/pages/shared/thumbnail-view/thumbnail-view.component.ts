import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentModel } from '@core/api/nuxeo/lib';

@Component({
  selector: 'tbwa-thumbnail-view-item',
  templateUrl: './thumbnail-view-item.component.html',
  styleUrls: ['./thumbnail-view-item.component.scss'],
})
export class ThumbnailViewItemComponent implements OnInit {
  @Input() styleClass: string;
  @Input() document: DocumentModel;

  get isRelated(): boolean {
    return this.styleClass === 'related';
  }

  ngOnInit() {
  }
}

@Component({
  selector: 'tbwa-thumbnail-view',
  styleUrls: ['./thumbnail-view.component.scss'],
  template: `
  <div class="{{styleClass}}" tabIndex="-1">
    <div *ngFor="let document of documents" class="thumbnail-view">
      <tbwa-thumbnail-view-item [document]="document" [styleClass]="styleClass" [tabIndex]="tabIndex"></tbwa-thumbnail-view-item>
    </div>
  </div>
  `,
})
export class ThumbnailViewComponent implements OnInit {

  @Input() layout: string;
  @Input() documents: Observable<DocumentModel[]>;
  @Input() tabIndex: number = -1;

  styleClass: string = 'quarter flex';
  styleList = {
    'agency': 'quarter flex',
    'brand': 'half flex',
    'search-list': 'results',
    'search-results': 'middle',
    'related': 'related',
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
