import { Component } from '@angular/core';
import { DocumentModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'learning-program-category',
  styleUrls: ['./learning-program-category.component.scss'],
  templateUrl: './learning-program-category.component.html',
})
export class LearningProgramCategoryComponent extends BaseDocumentViewComponent {

  loading: boolean = true;

  documents: any[] = [
    { title: 'EMERGING TALENT', uid: 'EMERGING TALENT', img: '/assets/images/category_0.png' },
    { title: 'FIRST TIME MANAGERS', uid: 'FIRST TIME MANAGERS', img: '/assets/images/category_0.png' },
    { title: 'RISING LEADERS', uid: 'RISING LEADERS', img: '/assets/images/category_0.png' },
    { title: 'SENIOR LEADERS', uid: 'SENIOR LEADERS', img: '/assets/images/category_0.png' },
    { title: 'EXECUTIVE LEADERS', uid: 'EXECUTIVE LEADERS', img: '/assets/images/category_0.png' },
  ];

  // documents: DocumentModel[] = [];

  // private params: any = {
  //   pageSize: 5,
  //   currentPageIndex: 0,
  //   ecm_path: NUXEO_PATH_INFO.LEARNING_BASE_FOLDER_PATH,
  //   ecm_primaryType: NUXEO_DOC_TYPE.LEARNING_PROGRAM_ASSET_TYPE,
  // };

  // constructor(protected documentPageService: DocumentPageService) {
  //   super(documentPageService);
  // }

  // onInit(): void {
  //   this.search(this.params);
  // }

  // private search(params: {}): void {
  //   const subscription = this.documentPageService.advanceRequest(new GlobalSearchParams(params))
  //     .subscribe((res: NuxeoPagination) => {
  //       this.documents = res.entries;
  //       this.loading = false;
  //     });
  //   this.subscription.add(subscription);
  // }
}
