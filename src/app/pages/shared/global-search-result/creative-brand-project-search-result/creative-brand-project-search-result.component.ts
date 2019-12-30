import { Component, Input, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DocumentModel } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { ActivatedRoute } from '@angular/router';
import { PreviewDialogService } from '@pages/shared/preview-dialog';

@Component({
  template: `
        <a (click)="open(dialog, document)"> {{ document.title }} </a>
        <ng-template #dialog>
          <preview-dialog>
              <creative-brand-project-list-preview [document]='document'></creative-brand-project-list-preview>
          </preview-dialog>
        </ng-template>
  `,
})
export class CreativeBrandProjectRowRenderComponent {
  constructor(
    private dialogService: PreviewDialogService,
  ) {
  }
  document: DocumentModel;
  @Input()
  set value(value: any) {
    this.document = value;
  }
  open(dialog: TemplateRef<any>, doc: DocumentModel, type: string) {
    this.dialogService.open(dialog, doc, { title: 'Brand Projects' });
  }
}

@Component({
  selector: 'creative-brand-project-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-brand-project-search-result.component.html',
})
export class CreativeBrandProjectSearchResultComponent extends AbstractSearchResultComponent {

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

  parentId: string = this.activatedRoute.snapshot.params.id;

  listViewSettings: any;

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
        type: 'custom',
        renderComponent: CreativeBrandProjectRowRenderComponent,
      },
      live_date: {
        title: 'Live Date',
        sort: false,
      },
      job_number: {
        title: 'Job Number',
        sort: false,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc,
        live_date: this.datepipe.transform(doc.get('The_Loupe_Rights:first-airing'), 'dd/MM/yyyy'),
        job_number: doc.get('The_Loupe_Main:jobnumber'),
      }));
    }
    return items;
  }

  constructor(
    private dialogService: PreviewDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected activatedRoute: ActivatedRoute,
    protected datepipe: DatePipe,
  ) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
