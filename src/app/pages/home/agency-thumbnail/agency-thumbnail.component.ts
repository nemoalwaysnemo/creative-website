import { Component, OnInit } from '@angular/core';
import { BasePageProvider } from '@core/api';
import { NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';
import { Subject } from 'rxjs';

@Component({
  selector: 'tbwa-agency-thumbnail',
  styleUrls: ['./agency-thumbnail.component.scss'],
  templateUrl: './agency-thumbnail.component.html',
})
export class AgencyThumbnailComponent implements OnInit {

  constructor(private basePageProvider: BasePageProvider) { }

  layout = 'agency';
  agencyDocuments: DocumentModel[];
  dataSource: PaginationDataSource = new PaginationDataSource();

  private params: any = {
    pageSize: 8,
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Image"]',
  };

  ngOnInit() {
    this.basePageProvider.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.agencyDocuments = res.entries;
        this.dataSource.from(res);
      });
  }

  changePage($event: any) {
    console.log($event, 'AgencyThumbnail');
  }
}
