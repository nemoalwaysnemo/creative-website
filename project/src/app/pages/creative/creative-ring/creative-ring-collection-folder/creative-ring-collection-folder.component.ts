import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable, of as observableOf, timer } from 'rxjs';
import { DocumentModel, UserModel, NuxeoPermission, GlobalSearchParams } from '@core/api';
import { SelectableItemService } from '../../../shared/document-selectable';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
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

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc)); });
      this.addChildrenPermission$ = !doc.hasFolderishChild ? doc.hasPermission(NuxeoPermission.AddChildren) : observableOf(false);
    }
  }
  protected buildAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path: NUXEO_PATH_INFO.CREATIVE_RING_PATH,
      pageSize: 100,
    };
    if (doc) {
      if (doc.get('The_Loupe_Main:collection_type') === 'Agency Collection'){
        params['the_loupe_main_agency'] = doc.get('dc:title');
      }else if (doc.get('The_Loupe_Main:collection_type') === 'Brand Collection'){
        params['the_loupe_main_brand_any'] = `["${doc.get('dc:title')}"]`;
      }else{
        params['pageSize'] = 0;
      }
    }
    return new GlobalSearchParams(params);
  }

}
