import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment.na-dev';
import { getDocumentTypes } from '@core/services';

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

  private subscription: Subscription = new Subscription();

  @Input() document: DocumentModel;

  constructor(
    private advanceSearch: AdvanceSearch,
    private nuxeoApi: NuxeoApiService,
    private location: Location,
  ) { }

  ngOnInit() {
    if (this.isCreativeAsset(this.document)) {
      this.getUsageRightsStatus();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isCreativeAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES).includes(doc.type);
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.DISRUPTION_DAY_TYPE).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
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

  goBack() {
    this.location.back();
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
