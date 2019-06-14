import { Component, TemplateRef, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api';
import { PreviewDialogService } from '@pages/shared/preview-dialog';
import { SearchQueryParamsService } from '@pages/shared/services/search-query-params.service';
import { Router } from '@angular/router';

@Component({
  selector: 'disruption-thinking-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-thinking-asset-search-result.component.html',
})
export class DisruptionThinkingAssetSearchResultComponent implements OnInit {

  constructor(
    private dialogService: PreviewDialogService,
    private queryParamsService: SearchQueryParamsService,
    private router: Router,
  ) { }

  deleteRedirect: string;
  backButton: boolean = false;
  showEdit: string = 'preview';

  ngOnInit() {
    this.dialogService.onClose().subscribe(_ => {
      this.showEdit = 'preview';
    });
    this.deleteRedirect = this.router.url;

  }

  open(dialog: TemplateRef<any>, doc: DocumentModel, type: string) {
    this.dialogService.open(dialog, doc, { title: 'Brilliant Thinking' });
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
    this.showEdit = 'edit';
  }

  callback(message: { type, value }): void {
    if (message.type === 'success') {
      this.reflash(message.value);
    } else if (message.type === 'back') {
      this.showEdit = message.value;
    }
  }

  reflash(doc: any): void {
    this.dialogService.setDocument(doc);
    this.queryParamsService.changeQueryParams({ refresh: true }, { type: 'refresh' }, 'merge');
  }
}
