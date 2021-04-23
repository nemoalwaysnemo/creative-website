import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectAssetPageComponent } from './document-creative-project-asset-page/document-creative-project-asset-page.component';

export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'AssetPage',
    title: 'Assets',
    selected: true,
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
