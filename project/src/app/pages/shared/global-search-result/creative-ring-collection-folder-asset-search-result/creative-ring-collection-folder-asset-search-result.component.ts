import { Component, Input, TemplateRef, Type } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DatePipe } from '@angular/common';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { SelectableItemSettings } from '../../document-selectable';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog';

@Component({
  selector: 'creative-ring-collection-folder-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-ring-collection-folder-asset-search-result.component.html',
})
export class CreativeRingCollectionFolderAssetSearchResultComponent extends BaseSearchResultComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: false,
    enableKnowledgeRelated: true,
  };

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_CREATIVE_RING_ASSET] });

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

}
