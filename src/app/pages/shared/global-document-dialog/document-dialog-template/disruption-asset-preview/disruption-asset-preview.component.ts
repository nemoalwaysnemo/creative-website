import { Component } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { getDocumentTypes, parseCountry } from '@core/services/helpers';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { SearchQueryParamsService } from '../../../services/search-query-params.service';
import { AbstractDocumentDialogPreviewTemplateComponent } from '../../abstract-document-dialog-preview-template.component';
import { Observable, of as observableOf } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'disruption-asset-preview',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './disruption-asset-preview.component.html',
})
export class DisruptionAssetPreviewDialogComponent extends AbstractDocumentDialogPreviewTemplateComponent {

  attachments: { type: string, url: string, title: string }[] = [];

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.attachments = this.document.getAttachmentList();
      this.writePermission$ = this.getDocumentPermission(doc, NuxeoPermission.Write, this.getSettings().enableEdit);
      this.deletePermission$ = this.getDocumentPermission(doc, NuxeoPermission.Delete, this.getSettings().enableDeletion);
    }
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: false,
      enableEdit: false,
      enablePreview: false,
      enableDeletion: false,
    };
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
  }

  parseCountry(list: string[]) {
    return parseCountry(list);
  }
}
