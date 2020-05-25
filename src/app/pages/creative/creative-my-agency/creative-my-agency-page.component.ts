import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { GlobalDocumentViewComponent, SearchQueryParamsService } from '@pages/shared';
import { AdvanceSearch, DocumentModel, UserService, NuxeoPageProviderParams, UserModel } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'creative-my-agency-page',
  templateUrl: './creative-my-agency-page.component.html',
  styleUrls: ['./creative-my-agency-page.component.scss'],
})
export class CreativeMyAgencyPageComponent extends GlobalDocumentViewComponent {

  hideEmpty: boolean = false;

  startUrl: string = 'https://docs.google.com/forms/d/e/1FAIpQLSec80v5JjUkTTywVUq83U3V8t4sKDzlQnaZHU8A9Y5CYr3yCw/viewform';

  constructor(
    private userService: UserService,
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);

    this.searchCurrentAgency().subscribe((doc: DocumentModel) => {
      if (doc) {
        this.redirectToAgency(doc.uid);
      }
    });
  }

  onInit(): void {
  }

  private redirectToAgency(uid: string): void {
    this.queryParamsService.navigate(['/p/creative/agency/' + uid + '/brand']);
  }

  protected setCurrentDocument(doc?: DocumentModel): void {
    this.document = doc;
    if (!doc) {
      this.hideEmpty = true;
    }
  }

  private searchCurrentAgency(): Observable<DocumentModel> {
    return this.userService.getCurrentUserInfo().pipe(
      // tap((user: UserModel) => { user.properties['companycode'] = '05001002'; }),
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
