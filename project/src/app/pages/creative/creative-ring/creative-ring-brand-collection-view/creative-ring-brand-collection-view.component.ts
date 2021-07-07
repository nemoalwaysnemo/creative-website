import { Component, Input, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { GlobalDocumentDialogService, DocumentPageService } from '@pages/shared';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { matchAssetUrl, vocabularyFormatter } from '@core/services/helpers';
import { GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';
import { Observable, of as observableOf } from 'rxjs';

@Component({
  selector: 'creative-ring-brand-collection-view',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-brand-collection-view.component.scss'],
  templateUrl: './creative-ring-brand-collection-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreativeRingBrandCollectionViewComponent {

  @Input() loading: boolean;

  @Input() assetUrl: string;

  @Input() assetUrlMapping: any = {};

  @Input() showButton: boolean = true;

  writePermission$: Observable<boolean> = observableOf(false);

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      if (this.showButton) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.editRedirectUrl = this.getAssetUrl(doc) + doc.uid;
      }
    }
  }

  doc: DocumentModel;

  editRedirectUrl: string = this.documentPageService.getCurrentUrl();

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_FORM.CREATIVE_RING_BRAND_COLLECTION_FORM] });

  dialogTitle: string = 'Upload Logo';

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: false,
    enableDeletion: false,
  };

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
    private documentPageService: DocumentPageService,
  ) { }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : matchAssetUrl(doc, this.assetUrlMapping);
  }

  openDialog(dialog: TemplateRef<any>, closeOnBackdropClick: boolean = true): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick });
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

}
