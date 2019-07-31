import { Component, Input } from '@angular/core';
import { BaseDialogBody } from '../../base-dialog-body';
import { PreviewDialogService } from '../../preview-dialog.service';
import { NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';

@Component({
  selector: 'disruption-asset-preview-dialog-body',
  styleUrls: ['../preview-dialog-body.scss'],
  templateUrl: './disruption-asset-preview-dialog-body.component.html',
})
export class DisruptionAssetPreviewDialogBodyComponent extends BaseDialogBody {

  title: string;

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  @Input() moreInfo: boolean = false;

  @Input() editButton: boolean = false;

  @Input() deleteButton: boolean = true;

  @Input() previewButton: boolean = false;

  attachments: { type: any, url: any, title: any }[] = [];

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
    this.writePermission$ = this.editButton && this.document.hasPermission(NuxeoPermission.Write);
    this.deletePermission$ = this.deleteButton && this.document.hasPermission(NuxeoPermission.Delete);
    this.attachments = this.document.buildAttachmentList();
  }

  openEditDialog(): void {
    this.callBack.next({ type: 'openEdit', value: true });
  }

  openDeleteDialog(): void {
    this.callBack.next({ type: 'openDelete', value: true });
  }
}
