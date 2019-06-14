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

  @Input() assetUrl: string;

  @Input() assetUrlMapping: object = {};

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.writePermission$ = this.doc.hasPermission(NuxeoPermission.Write);
    }
  }

  doc: DocumentModel;

  writePermission$: Observable<boolean>;

  constructor(
    protected previewDialogService: PreviewDialogService,
    protected queryParamsService: SearchQueryParamsService,
    private router: Router,
  ) { }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : this.matchAssetUrl(doc);
  }

  private matchAssetUrl(doc: DocumentModel): string {
    return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
  }

  openForm(dialog: any): void {
    this.previewDialogService.open(dialog, this.doc);
  }

  onUpdate(doc: DocumentModel): void {
    this.router.navigate(['/p/redirect'], { queryParams: { url: `/p/disruption/Disruption Days/day/${doc.uid}` } });
  }
}
