import { NbMenuItem } from '@core/nebular/theme';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';
import { DocumentCreativeProjectAssetPageComponent } from './document-creative-project-asset-page/document-creative-project-asset-page.component';

export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'asset-page',
    title: 'Assets',
    selected: true,
    settings: new CreativeProjectMgtSettings(),
    component: DocumentCreativeProjectAssetPageComponent,
  },
  {
    id: 'test-page',
    title: 'Test',
    component: DocumentCreativeProjectAssetPageComponent,
  },
  // {
  //   id: 'DeliveryPage',
  //   title: 'Deliverables',
  //   component: CreativeProjectAssetDeliverableTemplateComponent,
  // },
  // {
  //   id: 'ImportPage',
  //   title: 'Import',
  //   component: CreativeProjectAssetImportLocalTemplateComponent,
  // },
  // {
  //   title: '3rd Party Import',
  //   component: CreativeProjectAssetImportRequestTemplateComponent,
  // },
  // {
  //   title: 'Usage Rights',
  //   component: CreativeProjectAssetUsageRightsTemplateComponent,
  // },
  // {
  //   title: 'Completion Report',
  //   component: CreativeProjectAssetCompletionReportTemplateComponent,
  // },
];
