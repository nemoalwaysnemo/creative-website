import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tbwa-document-related-info',
  styleUrls: ['./document-related-info.component.scss'],
  templateUrl: './document-related-info.component.html',
})
export class DocumentRelatedInfoComponent implements OnInit {

  tabItems = [
    {
      name: 'Backslash',
      icon: 'nb-person',
    },
    {
      name: 'Distruption',
      icon: 'nb-person',
    },
    {
      name: 'Knowledge',
      icon: 'nb-person',
    },
    {
      name: 'Awards',
      icon: 'nb-person',
    },
    {
      name: 'Lorern Ipsum',
      icon: 'nb-person',
    },
  ];

  constructor() { }

  ngOnInit() {
  }
}
