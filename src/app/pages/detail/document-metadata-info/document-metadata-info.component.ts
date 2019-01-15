import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { DocumentModel, Automation, NuxeoPagination } from '@core/api';

@Component({
  selector: 'tbwa-document-metadata-info',
  styleUrls: ['./document-metadata-info.component.scss'],
  templateUrl: './document-metadata-info.component.html',
})
export class DocumentMetadataInfoComponent implements OnChanges {

  usageRights: any = {};

  @Input() document: DocumentModel;

  constructor(private automation: Automation) { }

  ngOnChanges(changes: SimpleChanges) {
    this.getUsageRightsStatus();
  }

  private getUsageRightsStatus(): void {
    this.automation.execute('Creative.GetDocumentURStatus', { 'uids': this.document.uid }).subscribe((res: NuxeoPagination) => {
      this.usageRights = res.entries.shift();
    });
  }
}
