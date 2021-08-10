import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams } from '@core/api';
import { DocumentPageService } from '../../../shared';
import { DocumentThumbnailViewSettings } from '../../../shared/document-thumbnail-view';
import { GlobalDocumentDialogService, GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG } from '../../../shared/global-document-dialog';
import { Subscription } from 'rxjs';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-best-showcase',
  styleUrls: ['./creative-best-showcase.component.scss'],
  templateUrl: './creative-best-showcase.component.html',
})
export class CreativeBestShowcaseComponent implements OnInit, OnDestroy {

  documents: DocumentModel[];

  loading: boolean = true;

  thumbnailViewSettings: DocumentThumbnailViewSettings = new DocumentThumbnailViewSettings({
    layout: 'full-width agency',
  });

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREVIEW_CREATIVE_ASSET] });

  dialogTitle: string = 'Creative';

  dialogMetadata: any = {
    moreInfo: true,
    enablePreview: true,
    enableDetail: true,
    enableKnowledgeRelated: true,
  };

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 9,
    ecm_path: NUXEO_PATH_INFO.CREATIVE_SHOWCASE_ASSET_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
  }

  ngOnInit(): void {
    this.search(this.params);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private search(params: any = {}): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }
}
