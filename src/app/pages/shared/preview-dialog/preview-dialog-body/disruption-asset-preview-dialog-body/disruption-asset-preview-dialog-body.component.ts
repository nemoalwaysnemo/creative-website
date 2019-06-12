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

  writePermission$: Observable<boolean>;

  deletePermission$: Observable<boolean>;

  @Input() moreInfo: boolean = false;

  @Input() editButton: boolean = false;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
    if (this.editButton) {
      this.writePermission$ = this.document.hasPermission(NuxeoPermission.Write);
    } else {
      this.writePermission$ = observableOf(false);
    }
    this.deletePermission$ = this.document.hasPermission(NuxeoPermission.delete);
  }

  openEditDialog(): void {
    this.callBack.next({ type: 'openEdit', value: true });
  }

  openDeleteDialog(): void {
    this.callBack.next({ type: 'openDelete', value: true });
  }
}
