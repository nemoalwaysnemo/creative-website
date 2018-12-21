import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, BasePageProvider } from '@core/api';

@Component({
  selector: 'tbwa-brand-thumbnail',
  styleUrls: ['./brand-thumbnail.component.scss'],
  templateUrl: './brand-thumbnail.component.html',
})
export class BrandThumbnailComponent implements OnInit {

  constructor(private basePageProvider: BasePageProvider) { }

  layout = 'brand';
  brandDocuments: DocumentModel[];

  private params: any = {
    pageSize: 2,
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Video"]',
  };

  ngOnInit() {
    this.basePageProvider.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.brandDocuments = res.entries;
      });
  }
}
