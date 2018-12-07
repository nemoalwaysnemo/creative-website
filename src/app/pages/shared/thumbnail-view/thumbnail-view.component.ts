import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { DocumentModel } from '@core/api/';
import { Observable } from 'rxjs';

@Component({
  selector: '[document]',
  templateUrl: './thumbnail-view-item.component.html',
})
export class ThumbnailViewItemComponent implements OnInit {
  @Input() document: DocumentModel;

  ngOnInit() {
  }
}

@Component({
  selector: 'tbwa-thumbnail-view',
  styleUrls: ['./thumbnail-view.component.scss'],
  template: `
  <ul>
    <li gridItem *ngFor="let document of documents" [document]="document" class="thumbnail-view">
     </li>
  </ul>
  `,
})
export class ThumbnailViewComponent implements OnInit {

  @Input() layout: string;
  @Input() documents: Observable<DocumentModel>[];

  constructor(
  ) { }

  ngOnInit() {
  }
}
