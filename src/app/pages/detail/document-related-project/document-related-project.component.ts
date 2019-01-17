import { Component, Input, OnInit } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';
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
  relatedProjectDocuments: DocumentModel[];
  paginationService: PaginationDataSource = new PaginationDataSource();

  private params: any = {
    pageSize: 4,
    // ecm_primaryType: NUXEO_META_INFO.LIBRARY_PROJECT_TYPES,
    ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_TYPES,
  };

  ngOnInit() {
    this.search(this.params);
    this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      this.search(Object.assign({}, this.params, pageInfo));
    });
  }

  private search(params: {}): void {
    this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.relatedProjectDocuments = res.entries;
        this.paginationService.from(res);
      });
  }
}
