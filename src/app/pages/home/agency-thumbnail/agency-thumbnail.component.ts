import { Component, OnInit } from '@angular/core';
import { BasePageProvider, NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-agency-thumbnail',
  styleUrls: ['./agency-thumbnail.component.scss'],
  templateUrl: './agency-thumbnail.component.html',
})
export class AgencyThumbnailComponent implements OnInit {

  constructor(private basePageProvider: BasePageProvider) { }

  layout = 'agency';
  agencyDocuments: DocumentModel[];

  private params: any = {
    pageSize: 8,
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Image"]',
  };

  ngOnInit() {
    this.basePageProvider.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.agencyDocuments = res.entries;
      });
  }
}
