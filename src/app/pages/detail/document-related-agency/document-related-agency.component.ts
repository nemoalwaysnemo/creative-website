import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';

@Component({
  selector: 'tbwa-document-related-agency',
  styleUrls: ['./document-related-agency.component.scss'],
  templateUrl: './document-related-agency.component.html',
})
export class DocumentRelatedAgencyComponent implements OnChanges {

  @Input() document: DocumentModel;

  constructor(private advanceSearch: AdvanceSearch) { }

  layout = 'agency';
  relatedAgencyDocuments: DocumentModel[];
  paginationService: PaginationDataSource = new PaginationDataSource();

  private params: any = {
    pageSize: 4,
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Image"]',
  };

  ngOnChanges(changes: SimpleChanges) {
    this.search(this.params);
    this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      this.search(Object.assign({}, this.params, pageInfo));
    });
  }

  private search(params: {}): void {
    this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.relatedAgencyDocuments = res.entries;
        this.paginationService.from(res);
      });
  }
}
