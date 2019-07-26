import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { NUXEO_PATH_INFO } from '@environment/environment';

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
      this.deletePermission$ = !doc.hasAnyContent ? this.doc.hasPermission(NuxeoPermission.Delete) : observableOf(false);
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

  goBack(): void {
    const rootPath: string = NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH;
    const splitPath: string = this.doc.path.split(rootPath)[1];
    const childSplitPath: string[] = splitPath.split('/');

    if (childSplitPath.length < 2) {
      this.router.navigate(['p/redirect'], { queryParams: { url: `/p/disruption/Disruption How Tos` } });
    } else {
      this.router.navigate(['p/redirect'], { queryParams: { url: `/p/disruption/Disruption How Tos/folder/${this.doc.parentRef}` } });
    }
  }
}
