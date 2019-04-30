import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'disruption-folders-view',
  styleUrls: ['../../../theme/styles/disruption-folders.scss'],
  templateUrl: './disruption-folders-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisruptionFoldersViewComponent {

  constructor(
    protected previewDialogService: PreviewDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) { }

  @Input() loading: boolean;

  @Input() document: any;

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.document);
  }

  onUpdate(doc: DocumentModel): void {
    this.queryParamsService.changeQueryParams({ refresh: true }, { type: 'refresh' }, 'merge');
  }
}
