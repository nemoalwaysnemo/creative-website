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
    { title: 'EMERGING TALENT', uid: '01', img: 'https://library-dev.factory.tools/nuxeo/nxpicsfile/default/3f9408ff-d254-45de-a2bd-893d989d6e3f/Small:content/Tue%20Jan%2012%2004%3A31%3A10%20UTC%202021' },
    { title: 'FIRST TIME MANAGERS', uid: '02', img: 'https://library-dev.factory.tools/nuxeo/nxpicsfile/default/3f9408ff-d254-45de-a2bd-893d989d6e3f/Small:content/Tue%20Jan%2012%2004%3A31%3A10%20UTC%202021' },
    { title: 'RISING LEADERS', uid: '03', img: 'https://library-dev.factory.tools/nuxeo/nxpicsfile/default/3f9408ff-d254-45de-a2bd-893d989d6e3f/Small:content/Tue%20Jan%2012%2004%3A31%3A10%20UTC%202021' },
    { title: 'SENIOR LEADERS', uid: '04', img: 'https://library-dev.factory.tools/nuxeo/nxpicsfile/default/3f9408ff-d254-45de-a2bd-893d989d6e3f/Small:content/Tue%20Jan%2012%2004%3A31%3A10%20UTC%202021' },
    { title: 'EXECUTIVE LEADERS', uid: '05', img: 'https://library-dev.factory.tools/nuxeo/nxpicsfile/default/3f9408ff-d254-45de-a2bd-893d989d6e3f/Small:content/Tue%20Jan%2012%2004%3A31%3A10%20UTC%202021' },
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
