import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { GlobalDocumentViewComponent, GlobalSearchFormSettings } from '@pages/shared';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'creative-ring-collection-folder',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-collection-folder.component.scss'],
  templateUrl: './creative-ring-collection-folder.component.html',
})
export class CreativeRingCollectionFolderComponent extends GlobalDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  addChildrenPermission$: Observable<boolean> = observableOf(false);

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableQueryParams: true,
  });

  currentView: string = 'thumbnailView';

  loading: boolean = true;

  onSearching: boolean = true;

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc && doc.get('collection:documentIds').length > 0) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc)); });
    } else {
      this.loading = false;
    }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
      the_loupe_main_collection_type: NUXEO_DOC_TYPE.CREATIVE_RING_AGENCY_ASSET_COLLECTION_TYPE,
    };
  }

  protected buildAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      ecm_uuid: `["${doc.get('collection:documentIds').join('", "')}"]`,
      currentPageIndex: 0,
      ecm_fulltext: '',
      pageSize: 100,
    };
    return params;
  }

  onLoading(loading: boolean): void {
    this.onSearching = loading;
  }

}
