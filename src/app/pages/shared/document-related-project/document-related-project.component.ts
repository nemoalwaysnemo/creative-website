import { Component, Input, OnInit } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'document-related-project',
  styleUrls: ['./document-related-project.component.scss'],
  templateUrl: './document-related-project.component.html',
})
export class DocumentRelatedProjectComponent implements OnInit {

  layout: string = 'quarter full-width';

  loading: boolean = true;

  documents: DocumentModel[];

  private params: any = {
    pageSize: 4,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_TYPES,
    the_loupe_main_brand_any: '',
    ecm_uuid_exclude: '',
  };

  @Input() document: DocumentModel;

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnInit() {
    this.params.the_loupe_main_brand_any = `["${this.document.get('The_Loupe_Main:brand').join('", "')}"]`;
    this.params.ecm_uuid_exclude = this.document.uid;
    this.search(this.params);
  }

  private search(params: {}): void {
    this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.loading = false;
        this.documents = res.entries;
      });
  }
}
