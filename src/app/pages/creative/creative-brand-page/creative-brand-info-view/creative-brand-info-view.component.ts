import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api';
import { TAB_CONFIG } from '../creative-brand-tab-config';
import { ActivatedRoute } from '@angular/router';
import { parseTabRoute } from '@core/services';

@Component({
  selector: 'creative-brand-info-view',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './creative-brand-info-vew.component.html',
})
export class CreativeBrandInfoViewComponent implements OnInit, OnDestroy {

  @Input() loading: boolean;

  @Input() document: DocumentModel;

  private tabConfig: any[] = TAB_CONFIG;

  tabs: any[] = [];

  constructor(protected activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.parseTabRoute();
  }

  ngOnDestroy(): void {
  }

  protected parseTabRoute(): void {
    if (this.tabs.length === 0) {
      this.tabs = parseTabRoute(this.tabConfig, this.activatedRoute.snapshot.params);
    }
  }

}
