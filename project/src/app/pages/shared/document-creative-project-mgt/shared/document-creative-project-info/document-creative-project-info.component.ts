import { Component, Input, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoPagination, NuxeoRequestOptions } from '@core/api';
import { Subscription } from 'rxjs';
import { DocumentPageService } from '../../../../shared/services/document-page.service';

@Component({
  selector: 'document-creative-project-info',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-info.component.html',
})
export class DocumentCreativeProjectInfoComponent implements OnDestroy {

  loading: boolean = true;

  doc: DocumentModel;

  campaignName: string;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.getCampaign(doc);
      this.loading = false;
    }
  }

  protected subscription: Subscription = new Subscription();

  constructor(
    protected documentPageService: DocumentPageService,
  ) { }

  getCampaign(doc: DocumentModel): void {
    if (this.campaignName === undefined && this.hasCampaignValue(doc)) {
      const subscription = this.documentPageService.advanceRequest(this.getCampaignParams(doc), new NuxeoRequestOptions({ schemas: ['The_Loupe_Main'] }))
        .subscribe((res: NuxeoPagination) => {
          this.campaignName = res.entries.map((entry: DocumentModel) => entry.title).join(', ');
        });
      this.subscription.add(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private hasCampaignValue(doc: DocumentModel): boolean {
    return doc.get('The_Loupe_Main:campaign').length > 0;
  }

  private getCampaignParams(doc: DocumentModel): any {
    let ids = [], campaigns = [];
    const campaign = doc.get('The_Loupe_Main:campaign');
    if (typeof (campaign) === 'string') {
      ids.push(campaign);
    } else {
      ids = ids.concat(campaign);
    }
    campaigns = Array.from(new Set(ids));
    return { ecm_uuid: `["${campaigns.join('", "')}"]`, pageSize: campaign.length };
  }
}
