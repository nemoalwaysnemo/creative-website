import { Component, Input, OnDestroy, TemplateRef, Type } from '@angular/core';
import { concatMap, map, share } from 'rxjs/operators';
import { Subscription, Observable, of as observableOf } from 'rxjs';
import { getDocumentTypes, vocabularyFormatter } from '@core/services/helpers';
import { DocumentModel, NuxeoPagination, NuxeoAutomations, NuxeoPermission, UserModel, SearchResponse } from '@core/api';
import { NUXEO_DOC_TYPE } from '@environment/environment';
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
