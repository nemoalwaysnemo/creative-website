import { Component, TemplateRef, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api';
import { PreviewDialogService } from '@pages/shared/preview-dialog';
import { SearchQueryParamsService } from '@pages/shared/services/search-query-params.service';

@Component({
  selector: 'disruption-theory-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-theory-asset-search-result.component.html',
})
export class DisruptionTheoryAssetSearchResultComponent implements OnInit {

  constructor(
    private dialogService: PreviewDialogService,
    private queryParamsService: SearchQueryParamsService,
  ) {}

  showEdit: boolean = false;

  ngOnInit() {
    this.dialogService.onClose().subscribe(_ => {
      this.showEdit = false;
    });
  }

  open(dialog: TemplateRef<any>, doc: DocumentModel, type: string) {
    this.dialogService.open(dialog, doc, { title: 'Disruption How Tos' });
  }

  openEdit(callback: any): void {
    this.showEdit = true;
  }

  onUpdate(doc: any): void {
    this.showEdit = false;
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
