import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, NuxeoPagination, NuxeoRequestOptions, UserModel } from '@core/api';
import { DocumentCreativeProjectMgtBaseComponent } from '../../../document-creative-project-mgt-base.component';
import { DocumentPageService } from '../../../../services/document-page.service';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'document-creative-project-tab-asset-info',
  styleUrls: ['../../../document-creative-project-mgt.component.scss', '../../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-tab-asset-info.component.html',
})
export class DocumentCreativeProjectTabAssetInfoComponent extends DocumentCreativeProjectMgtBaseComponent {

  document: DocumentModel;

  loading: boolean = true;

  jobTitle: string;

  campaignName: string;

  hasGroup$: Observable<boolean> = observableOf(true);

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.hasGroup$ = this.hasUserGroup();
      this.getJob(doc);
      this.getCampaign(doc);
      this.loading = false;
    }
  }

  protected hasUserGroup(): Observable<boolean> {
    return this.documentPageService.getCurrentUser().pipe(map((user: UserModel) => user.canAccess()));
  }

  protected getJob(doc: DocumentModel): void {
    if (this.jobTitle === undefined && this.hasJobValue(doc)) {
      this.documentPageService.advanceRequest(this.getJobParams(doc))
        .subscribe((res: NuxeoPagination) => {
          this.jobTitle = res.entries.map((entry: DocumentModel) => entry.title).join(', ');
        });
    }
  }

  protected getCampaign(doc: DocumentModel): void {
    if (this.campaignName === undefined && this.hasCampaignValue(doc)) {
      this.documentPageService.advanceRequest(this.getCampaignParams(doc), new NuxeoRequestOptions({ schemas: ['The_Loupe_Main'] }))
      .subscribe((res: NuxeoPagination) => {
        this.campaignName = res.entries.map((entry: DocumentModel) => entry.title).join(', ');
      });
    }
  }

  private hasCampaignValue(doc: DocumentModel): boolean {
    return doc.get('The_Loupe_Main:campaign') && doc.get('The_Loupe_Main:campaign').length > 0;
  }

  private getCampaignParams(doc: DocumentModel): any {
    let ids = [], campaigns = [];
    const campaignName = doc.get('The_Loupe_Main:campaign');
    if (typeof (campaignName) === 'string') {
      ids.push(campaignName);
    } else {
      ids = ids.concat(campaignName);
    }
    campaigns = Array.from(new Set(ids));
    return { ecm_uuid: `["${campaigns.join('", "')}"]`, pageSize: campaignName.length };
  }

  private hasJobValue(doc: DocumentModel): boolean {
    return doc.get('The_Loupe_Main:jobtitle').length > 0;
  }

  private getJobParams(doc: DocumentModel): any {
    const jobTitle = doc.get('The_Loupe_Main:jobtitle');
    return { ecm_uuid: `["${jobTitle.join('", "')}"]`, pageSize: jobTitle.length, ecm_mixinType_not_in: '' };
  }
}
