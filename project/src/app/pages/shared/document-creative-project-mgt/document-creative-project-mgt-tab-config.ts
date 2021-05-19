import { NbMenuItem } from '@core/nebular/theme';
import { CreativeProjectMgtSettings } from './document-creative-project-mgt.interface';
import { DocumentCreativeProjectAssetPageComponent } from './document-creative-project-asset-page/document-creative-project-asset-page.component';
import { DocumentCreativeProjectImportAssetComponent } from './document-creative-project-import-asset-page/document-creative-project-import-asset.component';
import { DocumentCreativeProject3rdPartyImportComponent } from './document-creative-project-3rd-party-import-page/document-creative-project-3rd-party-import-page.component';
import { DocumentCreativeProjectDeliveryPackagePageComponent } from './document-creative-project-delivery-package-page/document-creative-project-delivery-package-page.component';

export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'asset-page',
    title: 'Assets',
    selected: true,
    settings: new CreativeProjectMgtSettings(),
    component: DocumentCreativeProjectAssetPageComponent,
  },
  {
    id: 'ImportPage',
    title: 'Import',
    component: DocumentCreativeProjectImportAssetComponent,
  },
  {
    id: '3rd-import-Page',
    title: '3rd-import',
    component: DocumentCreativeProject3rdPartyImportComponent,
  },
  {
    id: 'delivery-page',
    title: 'Delivery Packages',
    component: DocumentCreativeProjectDeliveryPackagePageComponent,
  },
  // {
  //   title: 'Usage Rights',
  //   component: CreativeProjectAssetUsageRightsTemplateComponent,
  // },
  // {
  //   title: 'Completion Report',
  //   component: CreativeProjectAssetCompletionReportTemplateComponent,
  // },
];
