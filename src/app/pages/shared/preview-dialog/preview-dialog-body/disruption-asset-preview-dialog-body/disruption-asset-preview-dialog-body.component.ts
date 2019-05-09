import { Component, Input, Output } from '@angular/core';
import { BaseDialogBody } from '../../base-dialog-body';
import { PreviewDialogService } from '../../preview-dialog.service';
import { Permission } from '@core/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'disruption-asset-preview-dialog-body',
  styleUrls: ['../preview-dialog-body.scss'],
  templateUrl: './disruption-asset-preview-dialog-body.component.html',
})
export class DisruptionAssetPreviewDialogBodyComponent extends BaseDialogBody {

  title: string;

  write$: Observable<boolean>;

  @Input() moreInfo: boolean = false;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
    this.write$ = this.document.hasPermission(Permission.Write);
  }

  closeInfo(): void {
    this.callBack.next({type: 'openEdit', value: true});
  }
}
