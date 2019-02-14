import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, Automation, AdvanceSearch, NuxeoPagination, Automations } from '@core/api';
import { Subscription } from 'rxjs';

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
    private automation: Automation,
  ) { }

  ngOnInit() {
    this.getUsageRightsStatus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    const subscription = this.automation.execute(Automations.GetDocumentURStatus, { 'uids': this.document.uid })
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
