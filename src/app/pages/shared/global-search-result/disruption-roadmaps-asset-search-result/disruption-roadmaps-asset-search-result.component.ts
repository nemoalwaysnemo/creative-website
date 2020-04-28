import { Component, TemplateRef, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Router } from '@angular/router';
import { GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';

@Component({
  selector: 'disruption-roadmaps-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-roadmaps-asset-search-result.component.html',
})
export class DisruptionRoadmapsAssetSearchResultComponent implements OnInit {

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
    private queryParamsService: SearchQueryParamsService,
    private router: Router,
  ) { }

  deleteRedirect: string;

  showEdit: string = 'preview';

  backButton: boolean = false;

  previewComponent = GLOBAL_DOCUMENT_DIALOG.RELATED_DISRUPTION_ASSET_PREIVEW;

  formComponent = GLOBAL_DOCUMENT_FORM.DISRUPTION_ROADMAP_FORM;

  dialogMetadata: any = {
    enableEdit: true,
    enableDeletion: true,
  };

  ngOnInit() {
    // this.dialogService.onClose().subscribe(_ => {
    //   this.showEdit = 'preview';
    // });
    // this.deleteRedirect = this.router.url;
  }

  openDialog(dialog: TemplateRef<any>) {
    this.globalDocumentDialogService.open(dialog);
  }

  openEdit(event: any): void {
    if (event.type === 'openEdit') {
      this.showEdit = 'edit';
    } else if (event.type === 'openDelete') {
      this.backButton = true;
      this.showEdit = 'delete';
    }
  }

  onUpdate(doc: any): void {
    this.showEdit = 'preview';
  }

  callback(message: { type, value }): void {
    if (message.type === 'success') {
      this.reflash(message.value);
    } else if (message.type === 'back') {
      this.showEdit = message.value;
    }
  }

  reflash(doc: any): void {
    // this.dialogService.setDocument(doc);
    this.queryParamsService.refresh();
  }
}
