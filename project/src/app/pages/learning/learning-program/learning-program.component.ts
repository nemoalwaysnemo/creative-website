import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentPageService, GlobalDocumentViewComponent } from '@pages/shared';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-program',
  styleUrls: ['./learning-program.component.scss'],
  templateUrl: './learning-program.component.html',
})
export class LearningProgramComponent extends GlobalDocumentViewComponent {

  description: string = '';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe(_ => {
      this.description = this.document.get('dc:description');
    });
    this.subscription.add(subscription);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: this.documentPageService.getConfig('path:LEARNING_BASE_FOLDER_PATH'),
      ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_FOLDER_TYPE,
    };
  }

}
