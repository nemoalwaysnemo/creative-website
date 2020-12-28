import { Component, TemplateRef, Input } from '@angular/core';
import { SearchResponse } from '@core/api';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';
import { GLOBAL_DOCUMENT_FORM } from '../../global-document-form';

@Component({
  selector: 'disruption-featured-roadmaps-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-featured-roadmaps-asset-search-result.component.html',
})
export class DisruptionFeaturedRoadmapsAssetSearchResultComponent {

  @Input() enableScrolling: boolean = true;

  constructor(private globalDocumentDialogService: GlobalDocumentDialogService) {

  }

  title: string = 'Disruption Roadmaps';

  loadingStyle: any = { 'min-height': '400px' };

  redirectUrl: string = '/p/disruption/Disruption Roadmaps';

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET,
      GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM,
      GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION,
    ],
    current: GLOBAL_DOCUMENT_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET,
  });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: true,
    moreInfo: true,
  };

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick: false });
  }

  searchResultFilter(res: SearchResponse): boolean {
    return res.source === 'document-featured-roadmpaps';
  }

}
