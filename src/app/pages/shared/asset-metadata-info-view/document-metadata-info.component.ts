import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService } from '@core/api';
import { Subscription } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment.na-dev';
import { getDocumentTypes } from '@core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tbwa-document-metadata-info',
  styleUrls: ['./document-metadata-info.component.scss'],
  templateUrl: './document-metadata-info.component.html',
})
export class DocumentMetadataInfoComponent implements OnInit, OnDestroy {

  usageRights: any = {};

  usageLoading = true;

  jobTitle: string;

  jobLoading = true;

  backPath: string;

  private subscription: Subscription = new Subscription();

  @Input() document: DocumentModel;

  constructor(private advanceSearch: AdvanceSearch, private nuxeoApi: NuxeoApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.isCreativeAsset()) {
      this.getUsageRightsStatus();
    }
    this.backPath = '/#/p/disruption/days/folders?id=' + this.activatedRoute.snapshot.queryParams.folder;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isCreativeAsset(): boolean {
    return getDocumentTypes(NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES).includes(this.document.type);
  }

  isDisruptionAsset(): boolean {
    return getDocumentTypes(NUXEO_META_INFO.DISRUPTION_DAY_TYPE).includes(this.document.type);
  }

  isIntelligenceAsset(): boolean {
    return getDocumentTypes(NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE).includes(this.document.type);
  }

  toggleJob() {
    if (this.jobTitle === undefined && this.hasJobValue()) {
      this.advanceSearch.request(this.getRequestParams())
        .subscribe((res: NuxeoPagination) => {
          this.jobTitle = res.entries.map((entry: DocumentModel) => entry.title).join(', ');
          this.jobLoading = false;
        });
    } else {
      this.jobLoading = false;
    }
  }

  parseCountry(list: string[]) {
    return list.map((x) => x.split('/').pop()).join(', ');
  }

  private getUsageRightsStatus(): void {
    const subscription = this.nuxeoApi.operation(NuxeoAutomations.CreativeGetDocumentURStatus, { 'uids': this.document.uid })
      .subscribe((res: NuxeoPagination) => {
        this.usageRights = res.entries.shift();
        this.usageLoading = false;
      });
    this.subscription.add(subscription);
  }

  private hasJobValue(): boolean {
    return this.document.get('The_Loupe_Main:jobtitle').length > 0;
  }

  private getRequestParams(): any {
    const jobTitle = this.document.get('The_Loupe_Main:jobtitle');
    return { ecm_uuid: `["${jobTitle.join('", "')}"]` };
  }

}
