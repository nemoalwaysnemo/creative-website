import { Component, Input } from '@angular/core';
import { BaseDialogBodyComponent } from '../../base-dialog-body-component';
import { PreviewDialogService } from '../../preview-dialog.service';
import { NuxeoPermission, DocumentModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment';
import { getDocumentTypes } from '@core/services/helpers';

@Component({
  selector: 'disruption-asset-preview-dialog-body',
  styleUrls: ['../preview-dialog-body.scss'],
  templateUrl: './disruption-asset-preview-dialog-body.component.html',
})
export class DisruptionAssetPreviewDialogBodyComponent extends BaseDialogBodyComponent {

  title: string;

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  @Input() moreInfo: boolean = false;

  @Input() editButton: boolean = false;

  @Input() deleteButton: boolean = true;

  @Input() previewButton: boolean = false;

  attachments: { type: string, url: string, title: string }[] = [];

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
    this.writePermission$ = this.editButton && this.document.hasPermission(NuxeoPermission.Write);
    this.deletePermission$ = this.deleteButton && this.document.hasPermission(NuxeoPermission.Delete);
    this.attachments = this.document.getAttachmentList();
  }

  openEditDialog(): void {
    // this.callback.next({ type: 'openEdit', value: true });
  }

  openDeleteDialog(): void {
    // this.callback.next({ type: 'openDelete', value: true });
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }

  isIntelligenceAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.INTELLIGENCE_ASSET_TYPE).includes(doc.type);
  }
}
