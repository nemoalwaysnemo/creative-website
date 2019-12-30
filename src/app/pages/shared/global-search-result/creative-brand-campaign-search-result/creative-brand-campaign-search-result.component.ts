import { Component, Input, TemplateRef} from '@angular/core';
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
              <creative-brand-campaign-list-preview [document]='document'></creative-brand-campaign-list-preview>
          </preview-dialog>
        </ng-template>
  `,
})
export class CreativeBrandCampaignRowRenderComponent {
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
  selector: 'creative-brand-campaign-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-brand-campaign-search-result.component.html',
})
export class CreativeBrandCampaignSearchResultComponent extends AbstractSearchResultComponent {

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
        renderComponent: CreativeBrandCampaignRowRenderComponent,
      },
      edges: {
        title: 'Edges',
        sort: false,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc,
        edges: doc.get('app_Edges:Tags_edges').join(', '),
      }));
    }
    return items;
  }

  constructor(
    protected queryParamsService: SearchQueryParamsService,
    protected activatedRoute: ActivatedRoute,
    ) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
