import { Component, AfterViewChecked, OnDestroy } from '@angular/core';
import { GlobalSearchFormSettings, DocumentPageService } from '@pages/shared';
import { DocumentModel, SearchFilterModel } from '@core/api';
import { BaseDocumentViewComponent } from '../../shared/abstract-classes/base-document-view.component';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'knowledge-home',
  styleUrls: ['./knowledge-home.component.scss'],
  templateUrl: './knowledge-home.component.html',
})
export class KnowledgeHomeComponent extends BaseDocumentViewComponent implements AfterViewChecked {

  loading: boolean = true;

  headline: string = 'Welcome to the';

  subHead: string = 'Find insights, inspiration and creative work from around the collective.';

  folders: DocumentModel[] = [];

  filters: SearchFilterModel[] = [];

  defaultParams: any = {
    pageSize: 10,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: '/',
    ecm_primaryType: NUXEO_DOC_TYPE.KNOWLEDGE_ASSET_TYPE,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    placeholder: 'Search',
    enableQueryParams: false,
    skipAggregates: true,
  });

  constructor(
    protected documentPageService: DocumentPageService,
    protected router: Router,
  ) {
    super(documentPageService);
    this.onRouterChange();
  }

  onInit(): void {
    this.setCurrentDocument();
  }

  ngAfterViewChecked(): void {
    const header = document.querySelector('nb-layout-header');
    if ((typeof (header) !== 'undefined' && header !== null) && (this.router.url.includes('/knowledge/'))) {
      header.setAttribute('style', 'display:none');
      header.classList.remove('fixed');
    }
  }

  private onRouterChange(): void {
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
    ).subscribe((e: NavigationStart) => {
      if (!e.url.includes('/knowledge/')) {
        const header = document.querySelector('nb-layout-header');
        header.setAttribute('style', 'display:block');
        header.classList.add('fixed');
      }
    });
  }

}
