import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectDeliveryPackageHomeComponent } from './document-creative-project-delivery-package-home/document-creative-project-delivery-package-home.component';
import { DocumentCreativeProjectAssetPackageSendComponent } from './document-creative-project-asset-package-send/document-creative-project-asset-package-send.component';

export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'package-home-view',
    title: 'Package Home',
    component: DocumentCreativeProjectDeliveryPackageHomeComponent,
  },
  {
    id: 'package-send-view',
    title: 'Package Send',
    component: DocumentCreativeProjectAssetPackageSendComponent,
  },
];
