import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { getAssetModuleType } from '@core/services/helpers';
import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { HomeSearchFormComponent } from '../home-search-form/home-search-form.component';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'knowledge-search-form',
  templateUrl: './knowledge-search-form.component.html',
  styleUrls: ['./knowledge-search-form.component.scss'],
})

export class KnowledgeSearchFormComponent extends HomeSearchFormComponent implements AfterViewInit {

  @ViewChild('searchField', { static: true }) inputElement: ElementRef<HTMLInputElement>;

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'knowledge-search-form',
  });

  helpLink: string;

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(
      router,
      formBuilder,
      documentPageService,
      globalSearchFormService,
    );
  }

  protected onInit(): void {
    this.getHelpLink();
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.focus();
      this.inputElement.nativeElement.select();
    }
  }

  onKeyEnter(event: KeyboardEvent): void {
    const params = new GlobalSearchParams(this.getFormValue(), (this.openSearchFilter ? { showFilter: true } : {})).toQueryParams();
    this.redirectToListPage(params);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  getAssetUrl(doc: DocumentModel): string {
    let url = '';
    if (NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES.includes(doc.type)) {
      url = '/p/creative/asset';
    } else if (NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES.includes(doc.type)) {
      url = '/p/backslash/asset';
    } else if (NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE.includes(doc.type)) {
      url = '/p/intelligence/asset';
    } else if (NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE.includes(doc.type)) {
      if (doc.path.includes(NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH)) {
        url = '/p/disruption/Disruption Days/day/:parentRef/asset';
      } else if (doc.path.includes(NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH)) {
        url = '/p/disruption/Disruption How Tos/folder/:parentRef/asset';
      } else {
        url = '/p/disruption/asset';
      }
    } else if (NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE.includes(doc.type)) {
      if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + 'NEXT')) {
        url = '/p/innovation/NEXT/folder/:parentRef/asset';
      } else if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + 'Things to Steal')) {
        url = '/p/innovation/Things to Steal/folder/:parentRef/asset';
      }
    } else if (NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE.includes(doc.type)) {
      if (doc.type === 'App-BizDev-CaseStudy-Asset') {
        url = '/p/business-development/Case Studies/folder/:parentRef/asset';
      } else if (doc.type === 'App-BizDev-Thought-Asset') {
        url = '/p/business-development/Thought Leadership/folder/:parentRef/asset';
      }
    }
    return url.replace(':parentRef', doc.parentRef);
  }

  getAssetType(doc: DocumentModel): string {
    return getAssetModuleType(doc);
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
      if (doc) {
        this.helpLink = `/p/disruption/Disruption How Tos/folder/${doc.uid}`;
      }
    });
    this.subscription.add(subscription);
  }

}
