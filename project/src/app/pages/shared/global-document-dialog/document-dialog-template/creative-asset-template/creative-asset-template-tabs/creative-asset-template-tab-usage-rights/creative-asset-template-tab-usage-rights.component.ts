import { Component, Input } from '@angular/core';
import { DocumentModel, SearchResponse } from '@core/api';
import { DocumentPageService } from '../../../../../services/document-page.service';


@Component({
  selector: 'creative-asset-template-tab-usage-rights',
  styleUrls: ['./creative-asset-template-tab-usage-rights.component.scss'],
  templateUrl: './creative-asset-template-tab-usage-rights.component.html',
})
export class CreativeAssetTemplateTabUsageRightsComponent {

  constructor(protected documentPageService: DocumentPageService) { }

  hasData: boolean = false;

  selectedRows: any;

  listViewOptions: any = {
    selectMode: 'single', // single|multi
  };

  @Input() document: DocumentModel;

  onSelect(row: any): void {
    this.selectedRows = row.selected;
  }

  onResponse(res: SearchResponse): void {
    if (res.response.entries.length > 0) {
      this.hasData = true;
    }
  }
}
