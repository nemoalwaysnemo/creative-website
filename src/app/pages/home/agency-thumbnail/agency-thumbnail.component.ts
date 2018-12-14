import { Component, OnInit } from '@angular/core';
import { ThumbnailViewDataSource } from '@pages/shared/thumbnail-view/thumbnail-view-data-source.service';
import { NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-agency-thumbnail',
  styleUrls: ['./agency-thumbnail.component.scss'],
  templateUrl: './agency-thumbnail.html',
})
export class AgencyThumbnailComponent implements OnInit {

  constructor(private thumbnailViewDataSource: ThumbnailViewDataSource) { }

  layout = 'agency';
  agencyDocuments: DocumentModel[];

  ngOnInit() {
    this.thumbnailViewDataSource.request({ pageSize: 8 })
      .subscribe((res: NuxeoPagination) => {
        this.agencyDocuments = res.entries;
      });
  }
}
