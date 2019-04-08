import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel, NuxeoPageProviderParams } from '@core/api';
import { PaginationDataSource } from 'app/pages/shared/pagination/pagination-data-source';
import { SearchQueryParamsService } from 'app/pages/shared';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'favorites-thumbnail-view',
  templateUrl: './favorites-thumbnail-view.component.html',
  styleUrls: ['./favorites-thumbnail-view.component.scss'],
})

export class FavoritesThumbnailViewComponent {
  @Input() documents: any;
}
