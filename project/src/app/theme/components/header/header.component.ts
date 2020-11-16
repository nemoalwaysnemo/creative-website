import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NbMenuService, NbMenuItem } from '@core/nebular/theme';
import { UserModel, DocumentModel, NuxeoPagination, GlobalSearchParams } from '@core/api';
import { DocumentPageService } from '../../../pages/shared/services/document-page.service';
import { Environment, NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'library-ui-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any = {};

  helpLink: string;

  helpLinkloading: boolean = true;

  homePath: string = Environment.homePath;

  headerItems: any[] = [
    { title: 'Favorite' },
  ];

  private subscription: Subscription = new Subscription();

  constructor(
    private menuService: NbMenuService,
    private documentPageService: DocumentPageService) {
  }

  ngOnInit(): void {
    this.getUser();
    this.getHelpLink();
    this.updateHeaderTitle();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getUser(): void {
    const subscription = this.documentPageService.getCurrentUser().subscribe((user: UserModel) => {
      this.user = user;
    });
    this.subscription.add(subscription);
  }

  private getHelpLink(): void {
    const params = {
      pageSize: 1,
      currentPageIndex: 0,
      title_eq: 'Help & Support',
      ecm_path: NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_THEORY_FOLDER_TYPE,
    };
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries.shift()),
    ).subscribe((doc: DocumentModel) => {
      this.helpLinkloading = false;
      if (doc) {
        this.helpLink = `/p/disruption/Disruption How Tos/folder/${doc.uid}`;
      }
    });
    this.subscription.add(subscription);
  }

  private updateHeaderTitle(): void {
    const subscription = this.menuService.onItemClick()
      .pipe(
        filter((menu: { tag: string, item: NbMenuItem }) => menu.tag === 'sidebar'),
        map((menu: { tag: string, item: NbMenuItem }) => menu.item),
      )
      .subscribe((item: NbMenuItem) => {
        this.goToPage(item.title);
      });
    this.subscription.add(subscription);
  }

  selectLayout(type: string): boolean {
    return this.documentPageService.getCurrentUrl().includes(`/${type}/`);
  }

  goToPage(title: string): void {
    if (title === 'Favorite') {
      this.documentPageService.navigate(['/p/favorite']);
    }
  }
}
