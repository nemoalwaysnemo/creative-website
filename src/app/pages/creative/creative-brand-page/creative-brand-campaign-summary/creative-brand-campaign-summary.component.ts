import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocumentModel, SearchFilterModel, NuxeoPageProviderConstants } from '@core/api';
import { DocumentPageService, GlobalDocumentViewComponent, GlobalSearchFormSettings, DocumentListViewItem } from '@pages/shared';
import { ListSearchRowCustomDialogComponent } from '../../../shared/list-search-form-custom-view';
import { ListSearchRowCustomViewSettings } from '../../../shared/list-search-form/list-search-form.interface';
import { GlobalDocumentDialogSettings } from '../../../shared/global-document-dialog/global-document-dialog.interface';
import { GLOBAL_DOCUMENT_DIALOG } from '../../../shared/global-document-dialog';
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

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
  ];

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
      action: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
        }),
        renderComponent: ListSearchRowCustomDialogComponent,
      },
    },
  };

  listViewSettingsProject: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      action: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'button',
          enableClick: true,
          dialogSettings: new GlobalDocumentDialogSettings({
            components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_CREATIVE_PROJECT_ASSET],
          }),
        }),
        renderComponent: ListSearchRowCustomDialogComponent,
      },
    },
  };

  listViewSettingsAsset: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      action: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
        }),
        renderComponent: ListSearchRowCustomDialogComponent,
      },
    },
  };

  listViewBuilderCampaign: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        action: doc,
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
        action: doc,
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
        action: doc,
      }));
    }
    return items;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onSelectedCampaign(row: any): void {
    this.baseParamsProject$.next(this.buildProjectParams(this.document, row.isSelected ? row.data.action : null));
  }

  onSelectedProject(row: any): void {
    this.baseParamsAsset$.next(this.buildAssetParams(this.document, row.isSelected ? row.data.action : null));
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
      this.baseParamsProject$.next(this.buildProjectParams(doc));
      this.baseParamsAsset$.next(this.buildAssetParams(doc));
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

  protected buildCampaignParams(doc: DocumentModel): any {
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

  protected buildProjectParams(doc: DocumentModel, campaign?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_PROJECT_TYPE,
      ecm_mixinType: NuxeoPageProviderConstants.HiddenInNavigation,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    if (campaign) {
      params['the_loupe_main_campaign'] = `["${campaign.uid}"]`;
    }
    return params;
  }

  protected buildAssetParams(doc: DocumentModel, campaign?: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    if (campaign) {
      params['the_loupe_main_campaign'] = `["${campaign.uid}"]`;
    }
    return params;
  }

}
