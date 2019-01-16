import { Component, Input, OnInit } from '@angular/core';
import { DocumentModel, Automation, AdvanceSearch, NuxeoPagination, Automations } from '@core/api';

@Component({
  selector: 'tbwa-document-metadata-info',
  styleUrls: ['./document-metadata-info.component.scss'],
  templateUrl: './document-metadata-info.component.html',
})
export class DocumentMetadataInfoComponent implements OnInit {

  usageRights: any = {};

  usageLoading = true;

  jobTitle: string;

  jobLoading = true;

  @Input() document: DocumentModel;

  constructor(
    private advanceSearch: AdvanceSearch,
    private automation: Automation,
  ) { }

  ngOnInit() {
    this.getUsageRightsStatus();
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

  private getUsageRightsStatus(): void {
    this.automation.execute(Automations.GetDocumentURStatus, { 'uids': this.document.uid }).subscribe((res: NuxeoPagination) => {
      this.usageRights = res.entries.shift();
      this.usageLoading = false;
    });
  }

  private hasJobValue(): boolean {
    return this.document.get('The_Loupe_Main:jobtitle').length > 0;
  }

  private getRequestParams(): {} {
    const jobTitle = this.document.get('The_Loupe_Main:jobtitle');
    return { ecm_uuid: `["${jobTitle.join('", "')}"]` };
  }

}
