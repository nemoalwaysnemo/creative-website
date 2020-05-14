import { Component, OnInit } from '@angular/core';
import { NUXEO_META_INFO } from '@environment/environment';
import { AbstractDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { Observable } from 'rxjs';
import { AdvanceSearch, DocumentModel, UserService, NuxeoPageProviderParams, UserModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'creative-my-agency-search',
  templateUrl: './creative-my-agency-search.component.html',
  styleUrls: ['./creative-my-agency-search.component.scss'],
})
export class CreativeMyAgencySearchComponent extends AbstractDocumentViewComponent implements OnInit {

  hideEmpty: boolean = false;

  startUrl: string = 'https://docs.google.com/forms/d/e/1FAIpQLSec80v5JjUkTTywVUq83U3V8t4sKDzlQnaZHU8A9Y5CYr3yCw/viewform';

  constructor(
    private userService: UserService,
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  ngOnInit() {
    this.searchCurrentAgency().subscribe((doc: DocumentModel) => {
      if (doc) {
        this.redirectAgencyAsset(doc.uid);
      }
    });
  }

  redirectAgencyAsset(uid: string): void {
    this.queryParamsService.navigate(['/p/creative/agency/' + uid + '/showcase']);
  }

  protected setCurrentDocument(doc?: DocumentModel): void {
    this.document = doc;
    if (!doc) {
      this.hideEmpty = true;
    }
  }

  protected searchCurrentAgency(): Observable<DocumentModel> {
    return this.userService.getCurrentUserInfo().pipe(
      switchMap((user: UserModel) => this.searchCurrentDocument(this.getSearchParams(user))),
    );
  }

  private getSearchParams(user: UserModel): NuxeoPageProviderParams {
    const params = {
      pageSize: 1,
      ecm_fulltext: '',
      currentPageIndex: 0,
      the_loupe_main_companycode: user.get('companycode'), // 05001002
      ecm_primaryType: NUXEO_META_INFO.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_META_INFO.CREATIVE_AGENCY_FOLDER_TYPE,
    };
    return new NuxeoPageProviderParams(params);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {};
  }

}
