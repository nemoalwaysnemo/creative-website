import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, BasePageProvider } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';

@Component({
  selector: 'tbwa-brand-thumbnail',
  styleUrls: ['./brand-thumbnail.component.scss'],
  templateUrl: './brand-thumbnail.component.html',
})
export class BrandThumbnailComponent implements OnInit {

  constructor(private basePageProvider: BasePageProvider) { }

  layout = 'brand';
  brandDocuments: DocumentModel[];
  dataSource: PaginationDataSource = new PaginationDataSource();

  private params: any = {
    pageSize: 2,
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Video"]',
  };

  ngOnInit() {
    this.basePageProvider.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.brandDocuments = res.entries;
        this.dataSource.from(res);
      });
  }

  changePage($event: any) {
    console.log($event, 'BrandThumbnail');
  }
}
