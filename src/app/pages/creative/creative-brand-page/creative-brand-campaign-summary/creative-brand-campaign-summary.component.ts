import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AdvanceSearchService, DocumentModel, SearchFilterModel } from '@core/api';
import { ListSearchResultRowButtonDialogComponent, ListSearchResultRowButtonSettings } from '@pages/shared/list-search-form';
import { GLOBAL_DOCUMENT_DIALOG } from '@pages/shared/global-document-dialog';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings, DocumentListViewItem } from '@pages/shared';
import { GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog/global-document-dialog.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-brand-campaign-summary',
  templateUrl: './creative-brand-campaign-summary.component.html',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandCampaignSummaryComponent extends GlobalDocumentViewComponent {

  documents: DocumentModel[];

  target: DocumentModel;

  baseParamsCampaign$: Subject<any> = new Subject<any>();

  baseParamsProject$: Subject<any> = new Subject<any>();

  baseParamsAsset$: Subject<any> = new Subject<any>();

  layout: string = 'creative_brand_campaign full-width';

  filters: SearchFilterModel[] = [];

  searchFormSettingsCampaign: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'list-search-form-campaign',
    enableQueryParams: true,
  });

  searchFormSettingsProject: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'list-search-form-campaign-project',
  });

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'list-search-form-campaign-asset',
  });

  listViewSettingsCampaign: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      button: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchResultRowButtonSettings({
          dialogSettings: new GlobalDocumentDialogSettings({
            components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_CREATIVE_PROJECT_ASSET],
          }),
        }),
        renderComponent: ListSearchResultRowButtonDialogComponent,
      },
    },
  };

  listViewSettingsProject: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      button: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchResultRowButtonSettings({
          dialogSettings: new GlobalDocumentDialogSettings({
            components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_CREATIVE_PROJECT_ASSET],
          }),
        }),
        renderComponent: ListSearchResultRowButtonDialogComponent,
      },
    },
  };

  listViewSettingsAsset: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
    },
  };

  listViewBuilderCampaign: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        button: doc,
      }));
    }
    return items;
  }

  listViewBuilderProject: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        button: doc,
      }));
    }
    return items;
  }

  listViewBuilderAsset: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
      }));
    }
    return items;
  }

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(advanceSearchService, activatedRoute, documentPageService);
  }

  onSelectedCampaign(row: any): void {

  }

  onSelectedProject(row: any): void {

  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_FOLDER_TYPE,
      the_loupe_main_folder_type: NUXEO_DOC_TYPE.CREATIVE_BRAND_FOLDER_TYPE,
    };
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    if (doc) {
      this.baseParamsCampaign$.next(this.buildCampaignParams(doc));
      this.getTargetDocumentModel({
        pageSize: 1,
        currentPageIndex: 0,
        ecm_path: doc.path,
        ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_CAMPAIGN_FOLDER_TYPE,
      }).subscribe((target: DocumentModel) => {
        this.target = target;
        this.target.setParent(doc);
      });
    }
  }

  protected buildCampaignParams(doc?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_CAMPAIGN_TYPE,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }


}
