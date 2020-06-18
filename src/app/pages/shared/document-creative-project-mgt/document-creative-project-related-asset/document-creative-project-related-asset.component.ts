import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subject, timer } from 'rxjs';
import { ListSearchRowCustomViewComponent } from '../../list-search-form';
import { ListSearchRowCustomViewSettings } from '../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-creative-project-related-asset',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-related-asset.component.html',
})
export class DocumentCreativeProjectRelatedAssetComponent {

  loading: boolean = true;

  doc: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-creative-project-related-asset',
    enableSearchInput: false,
  });

  listViewSettings: any = {
    hideSubHeader: true,
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
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
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

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
    }
  }

  onSelected(row: any): void {

  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_uuid_not_eq'] = doc.uid;
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
  }

}
