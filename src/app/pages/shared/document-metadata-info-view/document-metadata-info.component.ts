import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';
import { getDocumentTypes } from '@core/services';

@Component({
  selector: 'document-metadata-info',
  styleUrls: ['./document-metadata-info.component.scss'],
  templateUrl: './document-metadata-info.component.html',
})
export class DocumentMetadataInfoComponent implements OnInit, OnDestroy {

  usageRights: any = {};

  usageLoading = true;

  jobTitle: string;

  jobLoading = true;

  private subscription: Subscription = new Subscription();

  documentModel: DocumentModel;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      if (this.isCreativeAsset(doc)) {
        this.getUsageRightsStatus(doc);
      }
    }
  }


  constructor(
    private advanceSearch: AdvanceSearch,
    private nuxeoApi: NuxeoApiService,
    private location: Location,
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isCreativeAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES).includes(doc.type);
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.DISRUPTION_DAY_ASSET_TYPES).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
  }

  toggleJob(doc: DocumentModel) {
    if (this.jobTitle === undefined && this.hasJobValue(doc)) {
      this.advanceSearch.request(this.getRequestParams(doc))
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

  private getUsageRightsStatus(doc: DocumentModel): void {
    this.usageLoading = true;
    const subscription = this.nuxeoApi.operation(NuxeoAutomations.CreativeGetDocumentURStatus, { 'uids': doc.uid })
      .subscribe((res: NuxeoPagination) => {
        this.usageRights = res.entries.shift();
        this.usageLoading = false;
      });
    this.subscription.add(subscription);
  }

  private hasJobValue(doc: DocumentModel): boolean {
    return doc.get('The_Loupe_Main:jobtitle').length > 0;
  }

  private getRequestParams(doc: DocumentModel): any {
    const jobTitle = doc.get('The_Loupe_Main:jobtitle');
    return { ecm_uuid: `["${jobTitle.join('", "')}"]` };
  }

}
