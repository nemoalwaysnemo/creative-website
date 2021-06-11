import { Component, OnChanges } from '@angular/core';
import { DocumentModel, UserModel, NuxeoRequestOptions, NuxeoAutomations } from '@core/api';
import { DocumentFormSettings } from '../../../document-form/document-form.interface';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
import { DynamicSuggestionModel, DynamicInputModel, DynamicTextAreaModel } from '@core/custom';
import { SuggestionSettings } from '../../../document-form-extension';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { of as observableOf, Observable, Subject, timer } from 'rxjs';
@Component({
  selector: 'creative-brand-project-3rd-party-import-review',
  templateUrl: './document-creative-project-3rd-party-import-review-page.component.html',
  styleUrls: ['../../document-creative-project-mgt.component.scss', './document-creative-project-3rd-party-import-review-page.component.scss'],
})
export class DocumentCreativeProject3rdPartyImportReviewComponent extends DocumentCreativeProjectMgtBaseComponent {

  loading: boolean = true;

  requestDocument: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'collection'],
    source: 'document-creative-project-import-requests-review',
    enableSearchInput: false,
  });

  listViewSettings: any = {
    hideHeader: false,
    hideSubHeader: true,
    columns: {
      thumbnail: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
          enableClick: true,
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        sort: false,
        title: 'title',
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        info: doc,
        thumbnail: doc,
        title: doc.title,
      }));
    }
    return items;
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.requestDocument = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(this.requestDocument)); });
    }
  }

  protected buildAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      ecm_path: doc.path,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    return params;
  }

  protected onInit(): void {
  }

  protected acceptAsset(request_id: any, assets_ids: any): Observable<any> {
    return this.documentPageService.operation(NuxeoAutomations.MoveAssetToLibrary, { request_id, assets_ids});
  }


  onSelected(row: any): void {
    this.acceptAsset(this.requestDocument.uid, row.data.info.uid).subscribe((res) => {
    });
  }

  }
