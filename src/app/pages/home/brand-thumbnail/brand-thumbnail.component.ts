import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';

@Component({
  selector: 'tbwa-brand-thumbnail',
  styleUrls: ['./brand-thumbnail.component.scss'],
  templateUrl: './brand-thumbnail.component.html',
})
export class BrandThumbnailComponent implements OnInit {

  constructor(private advanceSearch: AdvanceSearch) { }

  layout = 'brand';
  brandDocuments: DocumentModel[];

  private params: any = {
    pageSize: 2,
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Video"]',
  };

  ngOnInit() {
    this.advanceSearch.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.brandDocuments = res.entries;
      });
  }
}
