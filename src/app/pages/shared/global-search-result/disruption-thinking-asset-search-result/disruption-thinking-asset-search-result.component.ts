import { Component, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel } from '@core/api';
import { GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';

@Component({
  selector: 'disruption-thinking-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-thinking-asset-search-result.component.html',
})
export class DisruptionThinkingAssetSearchResultComponent implements OnInit {

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
    private queryParamsService: SearchQueryParamsService,
    private router: Router,
  ) { }

  deleteRedirect: string;

  backButton: boolean = false;

  showEdit: string = 'preview';

  previewComponent: any = GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET;

  ngOnInit() {
    // this.dialogService.onClose().subscribe(_ => {
    //   this.showEdit = 'preview';
    // });
    // this.deleteRedirect = this.router.url;
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  openEdit(event): void {
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
      this.refresh(message.value);
    } else if (message.type === 'back') {
      this.showEdit = message.value;
    }
  }

  refresh(doc: any): void {
    // this.dialogService.setDocument(doc);
    this.queryParamsService.refresh();
  }
}
