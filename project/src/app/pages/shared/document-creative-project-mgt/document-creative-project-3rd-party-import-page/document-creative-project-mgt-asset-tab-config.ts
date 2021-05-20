import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProject3rdImportRequestComponent } from './document-creative-project-3rd-party-import-request-page/document-creative-project-3rd-party-import-request-page.component';
import { DocumentCreativeProjectImportNewRequestComponent } from './document-creative-project-3rd-party-import-new-request/document-creative-project-import-new-request.component';
import { DocumentCreativeProject3rdPartyImportReviewComponent } from './document-creative-project-3rd-party-import-review-page/document-creative-project-3rd-party-import-review-page.component';
export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: '3rd-import-home-view',
    title: '3rd-import Home',
    component: DocumentCreativeProject3rdImportRequestComponent,
  },
  {
    id: '3rd-import-new-request',
    title: 'Create 3rd Party Import',
    component: DocumentCreativeProjectImportNewRequestComponent,
  },
  {
    id: '3rd-import-request-review',
    title: '3rd Party Import Reivew',
    component: DocumentCreativeProject3rdPartyImportReviewComponent,
  },
];
