import { Component, Input, OnInit } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from '../../shared/pagination/pagination-data-source';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-document-related-project',
  styleUrls: ['./document-related-project.component.scss'],
  templateUrl: './document-related-project.component.html',
})
export class DocumentRelatedProjectComponent implements OnInit {

  @Input() document: DocumentModel;

  constructor(private advanceSearch: AdvanceSearch) { }

  layout = 'agency';
  loading: boolean = true;
  relatedProjectDocuments: DocumentModel[];
  paginationService: PaginationDataSource = new PaginationDataSource();

  private params: any = {
    pageSize: 4,
    // ecm_primaryType: NUXEO_META_INFO.CREATIVE_PROJECT_TYPES,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_TYPES,
    the_loupe_main_brand_any: '',
  };

  ngOnInit() {
    this.params.the_loupe_main_brand_any = `["${this.document.brands.join('", "')}"]`;
    this.search(this.params);
    this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      this.search(Object.assign({}, this.params, pageInfo));
    });
  }

  private search(params: {}): void {
    this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.loading = false;
        this.relatedProjectDocuments = res.entries;
        this.paginationService.from(res);
      });
  }
}
