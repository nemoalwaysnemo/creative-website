import { Component } from '@angular/core';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
// import { Router } from '@angular/router';
// import { DocumentModel } from '@core/api';

@Component({
  selector: 'biz-dev-thought-leadership-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-thought-leadership-asset-search-result.component.html',
})
export class BizDevThoughtLeadershipAssetSearchResultComponent extends AbstractSearchResultComponent {

  constructor(
    protected queryParamsService: SearchQueryParamsService,
    // private router: Router
  ) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  // private navigateToDocument(doc?: DocumentModel) {
  //   if (doc.type === 'App-BizDev-Thought-Folder') {
  //     this.router.navigate(['/p/business-development/Thought Leadership/folder/', doc.uid], { queryParams: this.queryParams});
  //
  //   } else {
  //     this.router.navigate(['/p/business-development/asset/', doc.uid], { queryParams: this.queryParams});
  //   }
  // }

}
