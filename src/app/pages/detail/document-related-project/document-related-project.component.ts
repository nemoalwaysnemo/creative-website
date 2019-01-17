import { Component, Input, OnInit } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';

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
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Image"]',
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
