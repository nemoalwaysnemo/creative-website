import { Component, Input, TemplateRef, Type } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '../../services/document-page.service';
import { GlobalDocumentDialogService, GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG } from '../../../shared/global-document-dialog';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { NUXEO_DOC_TYPE } from '@environment/meta-info';
import { DocumentModelForm } from '../../../shared/global-document-form/global-document-form.component';

@Component({
  selector: 'disruption-document-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-document-asset-search-result.component.html',
})
export class DisruptionDocumentAssetSearchResultComponent extends BaseSearchResultComponent {

  private assetUrlMapping: any = {
    'App-Disruption-Day': '/p/disruption/Disruption Days/day',
    '*': '/p/disruption/asset',
  };

  @Input() showDialog: boolean = false;

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  dialogTitle: string = 'Disruption';

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  dialogXMetadata: any = {
    moreInfo: false,
    enableThumbnailImg: true,
    enableDetail: true,
    enableKnowledgeRelated: false,
  };

  isDisruptionX(doc: DocumentModel): boolean {
    return NUXEO_DOC_TYPE.DISRUPTION_X_TYPE.includes(doc.type);
  }

  isDisruptionDay(doc: DocumentModel): boolean {
    return NUXEO_DOC_TYPE.DISRUPTION_DAYS_TYPE.includes(doc.type);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
  }

  getDialogSettings(doc: DocumentModel): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    if (doc.type === 'App-DisruptionX-Module') {
      components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X);
    } else {
      components.push(GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

}
