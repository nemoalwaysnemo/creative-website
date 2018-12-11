import { Component, OnInit } from '@angular/core';
import { ThumbnailViewDataSource } from '@pages/shared/thumbnail-view/thumbnail-view-data-source.service';
import { NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-brand-thumbnail',
  styleUrls: ['./brand-thumbnail.component.scss'],
  templateUrl: './brand-thumbnail.html',
})
export class BrandThumbnailComponent implements OnInit {

  constructor(private thumbnailViewDataSource: ThumbnailViewDataSource) { }

  layout = 'standard';
  brandDocuments: DocumentModel[];

  ngOnInit() {
    this.thumbnailViewDataSource.request({ pageSize: 2 })
      .subscribe((res: NuxeoPagination) => {
        this.brandDocuments = res.entries;
    });
  }
}
