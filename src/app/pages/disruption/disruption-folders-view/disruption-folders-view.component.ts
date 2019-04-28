import { Component, Input, ChangeDetectionStrategy} from '@angular/core';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-folders-view',
  styleUrls: ['../../../theme/styles/disruption-folders.scss'],
  templateUrl: './disruption-folders-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisruptionFoldersViewComponent {

  constructor(protected previewDialogService: PreviewDialogService) {}

  @Input() loading: boolean;

  @Input() document: any;

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.document);
  }

}
