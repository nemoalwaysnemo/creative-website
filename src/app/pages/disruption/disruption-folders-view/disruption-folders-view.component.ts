import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { DocumentModel } from '@core/api';
import { NuxeoPermission } from '@core/api';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'disruption-folders-view',
  styleUrls: ['../../../theme/styles/disruption-folders.scss'],
  templateUrl: './disruption-folders-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisruptionFoldersViewComponent {

  @Input() loading: boolean;

  @Input() doc: DocumentModel;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.writePermission$ = this.doc.hasPermission(NuxeoPermission.Write);
    }
  }

  writePermission$: Observable<boolean>;

  constructor(
    protected previewDialogService: PreviewDialogService,
    protected queryParamsService: SearchQueryParamsService,
    private router: Router,
  ) { }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.doc);
  }

  onUpdate(doc: DocumentModel): void {
    this.router.navigate(['/p/redirect'], { queryParams: { url: `/p/disruption/Disruption Days/day/${doc.uid}` } });
  }
}
