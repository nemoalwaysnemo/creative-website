import { Component, OnInit } from '@angular/core';
import { BasePageProvider } from '@core/api';
import { NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-agency-thumbnail',
  styleUrls: ['./agency-thumbnail.component.scss'],
  templateUrl: './agency-thumbnail.html',
})
export class AgencyThumbnailComponent implements OnInit {

  constructor(private basePageProvider: BasePageProvider) { }

  layout = 'agency';
  agencyDocuments: DocumentModel[];

  ngOnInit() {
    this.basePageProvider.request({ pageSize: 8 })
      .subscribe((res: NuxeoPagination) => {
        this.agencyDocuments = res.entries;
      });
  }
}
