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

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
    if (this.editButton) {
      this.writePermission$ = this.document.hasPermission(NuxeoPermission.Write);
    }
    this.deletePermission$ = this.document.hasPermission(NuxeoPermission.Delete);
  }

  openEditDialog(): void {
    this.callBack.next({ type: 'openEdit', value: true });
  }

  openDeleteDialog(): void {
    this.callBack.next({ type: 'openDelete', value: true });
  }
}
