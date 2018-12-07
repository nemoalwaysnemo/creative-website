import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api/';

@Component({
  selector: 'tbwa-humor',
  styleUrls: ['./humor.component.scss'],
  templateUrl: './humor.component.html',
})
export class HumorComponent implements OnInit, OnDestroy {

  private alive: boolean = true;

  humorDocuments: DocumentModel[] = [
    {
      id: `1`,
      xPath: `test`,
      properties: ``,
    },
    {
      id: `2`,
      xPath: `test`,
      properties: ``,
    },
  ];

  layout = 'humor-layout';

  constructor() {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.alive = false;
  }
}
