import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { GlobalDocumentDialogSettings } from '../../global-document-dialog/global-document-dialog.interface';

@Component({
  selector: 'backslash-document-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-document-asset-search-result.component.html',
})
export class BackslashDocumentAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() layout: string;

  @Input() resultHeader: string;

  @Input() hideEmpty: boolean = false;

  backslashTitle: string = 'Backslash';

  dialogMetadata: any = {
    enableEdit: false,
    enableDeletion: false,
  };

  listViewSettings: any;

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.PREIVEW_BACKSLASH_HOME_ASSET] });

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: { title: doc.title, uid: doc.uid },
      }));
    }
    return items;
  }

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService, queryParamsService: SearchQueryParamsService) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  openDialog(dialog: TemplateRef<any>) {
    this.globalDocumentDialogService.open(dialog);
  }
}
