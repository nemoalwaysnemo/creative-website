import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PaginationDataSource } from 'app/pages/shared/pagination/pagination-data-source';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService, NuxeoRequestOptions } from '@core/api';
@Component({
  selector: 'favorites-thumbnail-view',
  templateUrl: './favorites-thumbnail-view.component.html',
  styleUrls: ['./favorites-thumbnail-view.component.scss'],
})

export class FavoritesThumbnailViewComponent implements OnInit {
  @Input() operation_params: any = {};
  paginationService: PaginationDataSource = new PaginationDataSource();
  documents: any;
  loading: boolean = true;
  constructor(private nuxeoApi: NuxeoApiService ) { }
  ngOnInit() {
    if (this.operation_params) {
    const subscription = this.nuxeoApi.operation( this.operation_params.operation_type,
      this.operation_params.params, this.operation_params.input, this.operation_params.opts )
              .subscribe((res: NuxeoPagination) => {
                this.loading = false;
                this.documents = res.entries;
                this.paginationService.from(res);
              });
            }
  }
}
