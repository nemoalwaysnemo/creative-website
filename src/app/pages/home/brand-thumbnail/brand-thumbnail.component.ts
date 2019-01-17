import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';

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
    ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_AUDIO_TYPES,
  };

  ngOnInit() {
    this.advanceSearch.request(this.params)
      .subscribe((res: NuxeoPagination) => {
        this.brandDocuments = res.entries;
      });
  }
}
