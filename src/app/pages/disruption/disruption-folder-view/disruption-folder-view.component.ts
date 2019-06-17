import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { DocumentModel } from '@core/api';
import { NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'disruption-folder-view',
  styleUrls: ['../../../theme/styles/disruption-folder.scss'],
  templateUrl: './disruption-folder-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisruptionFolderViewComponent {

  @Input() loading: boolean;
  showEdit: string = 'edit';
  @Input() deleteRedirect: string = '';

  @Input() assetUrl: string;

  @Input() assetUrlMapping: object = {};
  @Input() doc: DocumentModel;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.writePermission$ = this.doc.hasPermission(NuxeoPermission.Write);
      if (!doc.hasAnyContent) {
        this.deletePermission$ = this.doc.hasPermission(NuxeoPermission.Delete);
      }
    }
  }

  writePermission$: Observable<boolean> = observableOf(false);
  deletePermission$: Observable<boolean> = observableOf(false);

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

  openDialog(dialog: any, type): void {
    this.showEdit = type;
    this.previewDialogService.open(dialog, this.doc);
  }

  onUpdate(doc: DocumentModel): void {
    this.router.navigate(['/p/redirect'], { queryParams: { url: `/p/disruption/Disruption Days/day/${doc.uid}` } });
  }
}

