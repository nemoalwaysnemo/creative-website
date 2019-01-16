import { Component, Input, OnInit } from '@angular/core';
import { DocumentModel, Automation, AdvanceSearch, NuxeoPagination } from '@core/api';

@Component({
  selector: 'tbwa-document-metadata-info',
  styleUrls: ['./document-metadata-info.component.scss'],
  templateUrl: './document-metadata-info.component.html',
})
export class DocumentMetadataInfoComponent implements OnInit {

  usageRights: any = {};

  @Input() document: DocumentModel;

  jobTitle: any = undefined;
  jobParams: any = undefined;
  usageLoading = true;
  jobLoading = true;

  constructor(
    private advanceSearch: AdvanceSearch,
    private automation: Automation,
  ) { }

  ngOnInit() {
    this.getJobParams();
    this.getUsageRightsStatus();
  }

  toggleJob() {
    if (this.jobTitle === undefined && this.jobParams) {
      this.advanceSearch.request(this.jobParams)
        .subscribe((res: NuxeoPagination) => {
          this.jobTitle = res.entries.map((entry: DocumentModel) => entry.title).join(',');
          this.jobLoading = false;
        });
    } else {
      this.jobLoading = false;
    }
  }

  private getUsageRightsStatus(): void {
    this.automation.execute('Creative.GetDocumentURStatus', { 'uids': this.document.uid }).subscribe((res: NuxeoPagination) => {
      this.usageRights = res.entries.shift();
      this.usageLoading = false;
    });
  }

  private getJobParams() {
    const jobTitle = this.document.get('The_Loupe_Main:jobtitle');
    if (jobTitle.length >= 1) {
      this.jobParams = { ecm_uuid: `["${jobTitle.join('", "')}"]` };
    }
  }

}
