import { Component, Input, OnDestroy } from '@angular/core';
import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';
import { DocumentPageService } from '../services/document-page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'document-learning-category-info',
  styleUrls: ['./document-learning-category-info.component.scss'],
  templateUrl: './document-learning-category-info.component.html',
})

export class DocumentLearningCategoryInfoComponent implements OnDestroy {

  loading: boolean = true;

  doc: DocumentModel;

  documents: DocumentModel[] = [];

  protected subscription: Subscription = new Subscription();

  constructor(protected documentPageService: DocumentPageService) {
  }

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.search(doc);
    }
  }

  protected buildProgramParams(doc: DocumentModel): any {
    const params: any = {
      pageSize: 5,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.LEARNING_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_ASSET_TYPE,
    };
    if (doc) {
      params['app_learning_program_category_agg'] = '["' + doc.uid + '"]';
    }
    return params;
  }

  private search(doc: DocumentModel): void {
    const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(this.buildProgramParams(doc)))
      .subscribe((res: NuxeoPagination) => {
        this.documents = res.entries;
        this.loading = false;
      });
    this.subscription.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
