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
    {title: 'EMERGING TALENT', uid: '01', img: 'https://library-dev.factory.tools/nuxeo/api/v1/repo/default/id/061d23f0-4ba0-4371-85f7-28302c2900c2/@rendition/thumbnail?changeToken=12-0'},
    {title: 'FIRST TIME MANAGERS', uid: '02', img: 'https://library-dev.factory.tools/nuxeo/api/v1/repo/default/id/061d23f0-4ba0-4371-85f7-28302c2900c2/@rendition/thumbnail?changeToken=12-0'},
    {title: 'RISING LEADERS', uid: '03', img: 'https://library-dev.factory.tools/nuxeo/api/v1/repo/default/id/061d23f0-4ba0-4371-85f7-28302c2900c2/@rendition/thumbnail?changeToken=12-0'},
    {title: 'SENIOR LEADERS', uid: '04', img: 'https://library-dev.factory.tools/nuxeo/api/v1/repo/default/id/061d23f0-4ba0-4371-85f7-28302c2900c2/@rendition/thumbnail?changeToken=12-0'},
    {title: 'EXECUTIVE LEADERS', uid: '05', img: 'https://library-dev.factory.tools/nuxeo/api/v1/repo/default/id/061d23f0-4ba0-4371-85f7-28302c2900c2/@rendition/thumbnail?changeToken=12-0'},
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
