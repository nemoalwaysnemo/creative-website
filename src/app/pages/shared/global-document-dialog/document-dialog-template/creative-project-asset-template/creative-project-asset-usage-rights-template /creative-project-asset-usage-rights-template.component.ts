import { Component } from '@angular/core';
import { CreativeProjectAssetBaseTemplateComponent } from '../creative-project-asset-base-template.component';
import { GlobalDocumentDialogService } from '../../../../global-document-dialog/global-document-dialog.service';
import { SearchResponse, DocumentModel, NuxeoApiService } from '@core/api';
import { timer } from 'rxjs';

@Component({
  selector: 'creative-project-asset-usage-rights-template',
  styleUrls: ['../creative-project-asset-template.scss'],
  templateUrl: './creative-project-asset-usage-rights-template.component.html',
})
export class CreativeProjectAssetUsageRightsTemplateComponent extends CreativeProjectAssetBaseTemplateComponent {

  hasData: boolean = false;

  selectedRows: any;

  checkMode: boolean = true;

  listViewOptions: any;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected nuxeoApi: NuxeoApiService,
  ) {
    super();
  }

  linkEvent(): void {
    if (this.selectedRows) {
      const uids: string[] = this.selectedRows.map((doc: DocumentModel) => doc.uid);
      if (uids.length > 0) {
        // const subscription = this.nuxeoApi.operation(NuxeoAutomations.DocumentCreate, { 'uuid': `${uids.join(',')}` }).subscribe((res: DocumentModel) => {
          this.globalDocumentDialogService.triggerEvent({ name: `Link Contracts`, type: 'callback', messageType: 'success', messageContent: 'Link Contracts has been created successfully!' });
          timer(3000).subscribe(() => {
            this.globalDocumentDialogService.triggerEvent({ name: `Link Contracts`, type: 'callback' });
          });
          this.refresh();
        // });
        // this.subscription.add(subscription);
      }
    }
  }

  editEvent(): void {

  }

  onSelect(row: any): void {
    this.selectedRows = row.selected;
  }

  onResponse(res: SearchResponse): void {
    if (res.response.entries.length > 0) {
      this.hasData = true;
    }
  }

  refresh(): any {
    this.listViewOptions = {
      selectMode: 'multi', // single|multi
    };
  }
}
