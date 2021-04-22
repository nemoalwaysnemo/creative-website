import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DocumentPageService } from '../../../services/document-page.service';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { SearchFilterModel } from '../../../global-search-filter/global-search-filter.interface';
import { ProjectMgtNavigationSettings } from './document-creative-project-navigation.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';

@Component({
  selector: 'document-creative-project-navigation',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-navigation.component.html',
})
export class DocumentCreativeProjectNavigationComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  currentUser: UserModel;

  defaultParams: any;

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

  protected navSettings$: Subject<ProjectMgtNavigationSettings> = new Subject<ProjectMgtNavigationSettings>();

  protected document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  protected subscription: Subscription = new Subscription();

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

  protected onInit(): void {

  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentPageService.getCurrentUser(),
      this.navSettings$,
    ]).subscribe(([doc, user, settings]: [DocumentModel, UserModel, ProjectMgtNavigationSettings]) => {
      this.filters = settings.searchFormFilters;
      this.defaultParams = settings.searchFormParams;
      this.searchFormSettings = settings.searchFormSettings;
      this.currentUser = user;
      this.document = doc;
    });
    this.subscription.add(subscription);
  }
}
