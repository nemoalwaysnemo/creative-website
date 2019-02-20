import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdvanceSearch, NuxeoPagination, DocumentModel } from '@core/api';
import { PaginationDataSource } from '../../../shared/pagination/pagination-data-source';
import { NUXEO_META_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';
import {
  NbMenuItem,
} from 'app/core/nebular/theme';

@Component({
  selector: 'tbwa-disruption-page',
  styleUrls: ['./disruption-days.component.scss'],
  templateUrl: './disruption-days.component.html',
})
export class DisruptionDaysComponent implements OnInit, OnDestroy {
  layout: any = {};
  sidebar: any = {};
  private alive = true;
  currentTheme: string;
  agencyDocuments: DocumentModel[];
  loading: boolean = true;
  paginationService: PaginationDataSource = new PaginationDataSource();
  private subscription: Subscription = new Subscription();
  private params: any = {
    pageSize: 30,
    ecm_primaryType: NUXEO_META_INFO.DISRUPTION_DAYS_TYPE,
    ecm_path: NUXEO_META_INFO.DISRUPTION_DAYS_PATH,
  };
  constructor(private advanceSearch: AdvanceSearch) { }
  ngOnInit() {
    this.search(this.params);
    const subscription = this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      this.search(Object.assign({}, this.params, pageInfo));
    });
    this.subscription.add(subscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private search(params: {}): void {
    const subscription = this.advanceSearch.request(params)
      .subscribe((res: NuxeoPagination) => {
        this.agencyDocuments = res.entries;
        this.loading = false;
        this.paginationService.from(res);
      });
    this.subscription.add(subscription);
  }

  subMenu: NbMenuItem[] = [
    {
      title: 'DISRUPTION DAYS',
      link: '/p/disruption/disruptiondays',
    },
    {
      title: 'DISRUPTION ROADMAPS',
      link: '/p/disruption/roadmaps',
    },
    {
      title: 'DISRUPTION THEORY',
      link: '/pages/ui-features/icons',
    },
    {
      title: 'STRATEGIC DOCS',
      link: '/pages/ui-features/modals',
    },
    {
      title: 'DISRUPTION AWARDS',
      link: '/pages/ui-features/typography',
    },
  ];
}
