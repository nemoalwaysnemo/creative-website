
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DocumentModel, NuxeoAutomations } from '@core/api';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { Observable, Subject, timer } from 'rxjs';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { GlobalEvent } from '../../../../shared/services/document-page.service';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'creative-brand-project-3rd-party-import-review',
  templateUrl: './document-creative-project-3rd-party-import-review-page.component.html',
  styleUrls: ['../../document-creative-project-mgt.component.scss', './document-creative-project-3rd-party-import-review-page.component.scss'],
})
export class DocumentCreativeProject3rdPartyImportReviewComponent extends DocumentCreativeProjectMgtBaseComponent {

  loading: boolean = true;

  requestDocument: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  assetsMovingQueue: any[] = [];

  disabled: string = 'disabled';

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'collection'],
    source: 'document-creative-project-import-requests-review',
    enableSearchInput: false,
  });

  listViewSettings: any = {
    hideHeader: false,
    hideSubHeader: true,
    showCheckbox: true,
    selectMode: 'multi',
    columns: {
      thumbnail: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
          enableDialog: true,
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        sort: false,
        title: 'title',
        renderComponent: ListSearchRowCustomViewComponent,
      },
      production_date: {
        sort: false,
        title: 'Production Date',
        renderComponent: ListSearchRowCustomViewComponent,
      },
      modified_date: {
        sort: false,
        title: 'Upload Date',
      },
      asset_countries: {
        sort: false,
        title: 'Asset Countries',
      },
      job_number: {
        sort: false,
        title: 'Job Number',
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
        modified_date: this.formateDate(doc.properties['dc:modified']),
        production_date: this.formateDate(doc.properties['dc:created']),
        asset_countries: doc.properties['The_Loupe_Main:country'].join(','),
        job_number: doc.properties['The_Loupe_Main:jobnumber'],
        uid: doc.uid,
      }));
    }
    return items;
  };

  private formateDate(date: any): any {
    return date ? new DatePipe('en-US').transform(date, 'yyyy-MM-dd') : null;
  }

  protected setInputDocument(doc: DocumentModel): void {
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
      pageSize: 100,
    };
    return params;
  }

  protected onInit(): void {
  }

  protected acceptAsset(requestId: string, assetsId: string): Observable<any> {
    return this.documentPageService.operation(NuxeoAutomations.MoveAssetToLibrary, { request_id: requestId, assets_id: assetsId });
  }

  moveAssets(): void {
    this.assetsMovingQueue.forEach((row) => {
      this.acceptAsset(this.requestDocument.uid, row.uid).subscribe(_ => {
        this.refresh();
      });
    });
    this.showMsg();
  }

  onSelected(row: any): void {
    if (row.selected && row.selected.length > 0) {
      this.disabled = '';
    } else {
      this.disabled = 'disabled';
    }
    this.assetsMovingQueue = row.selected;
  }

  goHome(): void {
    const settings = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: '3rd-import-home-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }

  showMsg(): void {
    this.documentPageService.notify('Documents have been approved successfully!', '', 'success');
  }

  private refresh(): void {
    this.triggerChangeView('3rd-import-request-review', 'view',
      new CreativeProjectMgtSettings({
        mainViewChanged: true,
        document: this.requestDocument,
        project: this.templateSettings.project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: '3rd-import-Page',
        homeView: '3rd-import-home-view',
        showMessageBeforeSave: false,
      }));
  }
}
