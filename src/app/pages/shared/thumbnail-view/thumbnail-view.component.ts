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
  <div class="{{styleClass}}">
    <div *ngFor="let document of documents" class="thumbnail-view">
      <tbwa-thumbnail-view-item [document]="document" [styleClass]="styleClass"></tbwa-thumbnail-view-item>
    </div>
  </div>
  `,
})
export class ThumbnailViewComponent implements OnInit {

  @Input() layout: string;
  @Input() documents: Observable<Document[]>;

  styleClass: string = 'small';
  styleList = {
    'agency': 'quarter flex',
    'brand': 'half flex',
    'search-list': 'results',
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
