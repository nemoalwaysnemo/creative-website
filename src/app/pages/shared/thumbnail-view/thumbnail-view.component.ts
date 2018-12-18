import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'tbwa-thumbnail-view-item',
  templateUrl: './thumbnail-view-item.component.html',
  styleUrls: ['./thumbnail-view-item.component.scss'],
})
export class ThumbnailViewItemComponent implements OnInit {
  @Input() styleClass: string;
  @Input() document: Document;

  ngOnInit() {
  }
}

@Component({
  selector: 'tbwa-thumbnail-view',
  styleUrls: ['./thumbnail-view.component.scss'],
  template: `
  <ul class="{{styleClass}}">
    <li *ngFor="let document of documents" class="thumbnail-view">
      <tbwa-thumbnail-view-item [document]="document" [styleClass]="styleClass"></tbwa-thumbnail-view-item>
    </li>
  </ul>
  `,
})
export class ThumbnailViewComponent implements OnInit {

  @Input() layout: string;
  @Input() documents: Observable<Document[]>;

  styleClass: string = 'small';
  styleList = {
    'agency': 'small',
    'brand': 'two-columns',
    'search-list': 'search-list',
    'search-results': 'middle',
  };

  constructor() {

  }

  ngOnInit() {
    this.setStyleClass(this.layout);
  }

  private setStyleClass(layout) {
    this.styleClass = this.styleList[layout] || 'small';
  }
}
