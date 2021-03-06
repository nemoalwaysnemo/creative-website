import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentModel, SearchResponse } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../../global-document-form';


@Component({
  selector: 'backslash-pipeline-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './backslash-pipeline-asset-search-result.component.html',
})
export class BackslashPipelineAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() enableScrolling: boolean = true;

  @Input() resultHeader: string;

  backslashTitle: string = 'Backslash';

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: false,
  };

  listViewSettings: any;

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_BACKSLASH_HOME_ASSET,
      GLOBAL_DOCUMENT_FORM.BACKSLASH_ASSET_POST_FORM,
      GLOBAL_DOCUMENT_FORM.BACKSLASH_ASSET_VIDEO_FORM,
    ],
    current: GLOBAL_DOCUMENT_DIALOG.PREVIEW_BACKSLASH_HOME_ASSET,
  });

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
    },
  };

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: { title: doc.title, uid: doc.uid },
      }));
    }
    return items;
  };

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService, documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

  searchResultFilter(res: SearchResponse): boolean {
    return res.source === 'document-backslash-pipeline';
  }
}
