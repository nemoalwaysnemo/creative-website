import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PreviewDialogService, SearchQueryParamsService } from '@pages/shared';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { getDocumentTypes } from '@core/services/helpers';

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
  @Input() backAssetFlag: boolean = false;

  @Input() assetUrlMapping: object = {};
  @Input() doc: DocumentModel;

  @Input() showButton: boolean = true;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      if (this.showButton) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.deletePermission$ = !doc.hasAnyContent ? this.doc.hasPermission(NuxeoPermission.Delete) : observableOf(false);
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
    this.previewDialogService.open(dialog, this.doc, { type: this.doc.type });
  }

  onUpdate(doc: DocumentModel): void {
    this.router.navigate(['/p/redirect'], { queryParams: { url: decodeURI(this.router.url) } });
  }

  goBack(): void {
    const parentInfo: any = this.goBackInfo(this.doc.type);
    const rootPath: string = parentInfo.rootPath;
    const splitPath: string = this.doc.path.split(rootPath)[1];
    const childSplitPath: string[] = splitPath.split('/');

    if (childSplitPath.length < 2) {
      this.router.navigate(['p/redirect'], { queryParams: { url: `${parentInfo.urlRootPath}` } });
    } else {
      this.router.navigate(['p/redirect'], { queryParams: { url: `${parentInfo.urlParentPath}${this.doc.parentRef}` } });
    }
  }

  protected goBackInfo(type: string): any {
    switch (type) {
      case 'App-Disruption-Theory-Folder':
        return {
          'rootPath': NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
          'urlRootPath': '/p/disruption/Disruption How Tos',
          'urlParentPath': '/p/disruption/Disruption How Tos/folder/',
        };
      case 'App-Disruption-Day':
        return {
          'rootPath': NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
          'urlRootPath': '/p/disruption/Disruption Days',
          'urlParentPath': '/p/disruption/Disruption Days/day/',
        };
      default:
        return {};
    }
  }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }
}
