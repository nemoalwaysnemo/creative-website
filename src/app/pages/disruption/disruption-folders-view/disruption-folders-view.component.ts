import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { DocumentModel } from '@core/api';
import { NuxeoPermission } from '@core/api';
import { Observable } from 'rxjs';

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

  @Input() doc: DocumentModel;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.writePermission$ = this.doc.hasPermission(NuxeoPermission.Write);
    }
  }

  writePermission$: Observable<boolean>;

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.doc);
  }

  onUpdate(doc: DocumentModel): void {
    this.queryParamsService.changeQueryParams({ refresh: true }, { type: 'refresh' }, 'merge');
  }
}
