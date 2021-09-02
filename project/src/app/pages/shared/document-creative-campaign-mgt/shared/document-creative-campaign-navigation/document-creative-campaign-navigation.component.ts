import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { NbMenuItem } from '@core/nebular/theme';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { OptionModel } from '../../../option-select/option-select.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { CreativeCampaignMgtSettings } from '../../document-creative-campaign-mgt.interface';
import { SearchFilterModel } from '../../../global-search-filter/global-search-filter.interface';
import { CampaignMgtNavigationSettings } from './document-creative-campaign-navigation.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { TAB_CONFIG } from '../../document-creative-campaign-mgt-tab-config';

@Component({
  selector: 'document-creative-campaign-navigation',
  styleUrls: ['../../document-creative-campaign-mgt.component.scss', './document-creative-campaign-navigation.component.scss'],
  templateUrl: './document-creative-campaign-navigation.component.html',
})
export class DocumentCreativeCampaignNavigationComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  currentUser: UserModel;

  defaultPage: string = 'campaign-asset-page';

  selectedItem: string;

  defaultParams: any;

  options: OptionModel[];

  filters: SearchFilterModel[] = [];

  searchFormSettings: GlobalSearchFormSettings;

  baseParams$: Subject<any> = new Subject<any>();

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: any) {
    this.navSettings$.next(settings);
  }

  protected navSettings$: Subject<CampaignMgtNavigationSettings> = new Subject<CampaignMgtNavigationSettings>();

  protected document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  protected subscription: Subscription = new Subscription();

  private tabs: NbMenuItem[] = TAB_CONFIG;

  constructor(
    protected documentPageService: DocumentPageService,
  ) {
    this.onDocumentChanged();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  goHome(): void {
    this.triggerChangePage(this.defaultPage);
  }

  onChange(event: any): void {
    this.triggerChangePage(event.value);
  }

  protected onInit(): void {
    this.options = this.buildPageList();
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentPageService.getCurrentUser(),
      this.navSettings$,
    ]).subscribe(([doc, user, settings]: [DocumentModel, UserModel, CampaignMgtNavigationSettings]) => {
      this.selectedItem = settings.currentPage;
      this.filters = settings.searchFormFilters;
      this.defaultParams = settings.searchFormParams;
      this.searchFormSettings = settings.searchFormSettings;
      this.currentUser = user;
      this.document = doc;
    });
    this.subscription.add(subscription);
  }

  buildPageList(): OptionModel[] {
    return this.tabs.map((t: NbMenuItem) => new OptionModel({ label: t.title, value: t.id }));
  }

  private getPageComponent(view: string): any {
    const page = this.tabs.find((t: NbMenuItem) => t.id === view);
    return page ? page.component : null;
  }

  private triggerChangePage(view: string, settings: CreativeCampaignMgtSettings = {}): void {
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedViewChanged', data: { view, type: 'page', settings, component: this.getPageComponent(view) }, type: 'creative-campaign-project-mgt' }));
  }

}
