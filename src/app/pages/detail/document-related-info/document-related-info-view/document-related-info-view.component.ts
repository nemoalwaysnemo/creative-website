import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tbwa-document-related-info-view',
  styleUrls: ['./document-related-info-view.component.scss'],
  templateUrl: './document-related-info-view.component.html',
})
export class DocumentRelatedInfoViewComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }
}
