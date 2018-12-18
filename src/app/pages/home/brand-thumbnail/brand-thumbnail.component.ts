import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, BasePageProvider } from '@core/api';

@Component({
  selector: 'tbwa-brand-thumbnail',
  styleUrls: ['./brand-thumbnail.component.scss'],
  templateUrl: './brand-thumbnail.html',
})
export class BrandThumbnailComponent implements OnInit {

  constructor(private basePageProvider: BasePageProvider) { }

  layout = 'brand';
  brandDocuments: DocumentModel[];

  ngOnInit() {
    this.basePageProvider.request({ pageSize: 2 })
      .subscribe((res: NuxeoPagination) => {
        this.brandDocuments = res.entries;
      });
  }
}
