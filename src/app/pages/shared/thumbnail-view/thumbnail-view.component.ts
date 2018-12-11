import { Component, Input, OnInit } from '@angular/core';
import { Document } from '@core/api/';
import { Observable } from 'rxjs';
import { ThumbnailViewDataSource } from './thumbnail-view-data-source.service';

@Component({
  selector: 'tbwa-thumbnail-view-item',
  templateUrl: './thumbnail-view-item.component.html',
})
export class ThumbnailViewItemComponent implements OnInit {
  @Input() document: Document;

  ngOnInit() {
  }
}

@Component({
  selector: 'tbwa-thumbnail-view',
  styleUrls: ['./thumbnail-view.component.scss'],
  template: `
  <ul>
    <li *ngFor="let document of documents" class="thumbnail-view">
      <tbwa-thumbnail-view-item [document]="document"></tbwa-thumbnail-view-item>
    </li>
  </ul>
  `,
})
export class ThumbnailViewComponent implements OnInit {

  @Input() layout: string;
  @Input() documents: Observable<Document[]>;

  constructor(private thumbnailDataSource: ThumbnailViewDataSource) {
    this.thumbnailDataSource.search({
      currentPageIndex: 1,
      pageSize: 20,
      ecm_fulltext: '*dean',
    });
  }

  ngOnInit() {
  }
}
