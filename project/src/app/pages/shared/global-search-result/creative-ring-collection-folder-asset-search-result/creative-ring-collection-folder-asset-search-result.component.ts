import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '../../services/document-page.service';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';

@Component({
  selector: 'creative-ring-collection-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-ring-collection-folder-asset-search-result.component.html',
})
export class CreativeRingCollectionFolderAssetSearchResultComponent extends BaseSearchResultComponent {

  documents: DocumentModel[] = [];

  dialogMetadata: any = {
    formMode: 'edit',
    moreInfo: true,
    enablePreview: true,
    enableDetail: false,
    enableKnowledgeRelated: true,
  };

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_CREATIVE_RING_ASSET,
      GLOBAL_DOCUMENT_FORM.CREATIVE_RING_ASSET_FORM,
    ],
  });

  @Input() loading: boolean = true;

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  searchResult(docs: DocumentModel[]): void {
    this.documents = docs;
  }
}
