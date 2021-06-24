import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectAssetHomeComponent } from './document-creative-project-asset-home/document-creative-project-asset-home.component';
import { DocumentCreativeProjectAssetDetailComponent } from './document-creative-project-asset-detail/document-creative-project-asset-detail.component';
import { DocumentCreativeProjectModifyAssetsComponent } from './document-creative-project-modify-assets/document-creative-project-modify-assets.component';
import { DocumentCreativeProjectImportNewRequestComponent } from '../document-creative-project-3rd-party-import-page/document-creative-project-3rd-party-import-new-request/document-creative-project-import-new-request.component';
import { DocumentCreativeProjectImportAssetHomeComponent } from '../document-creative-project-import-asset-page/document-creative-project-import-asset-home/document-creative-project-import-asset-home.component';
import { DocumentCreativeProjectAssetPackageSendComponent } from '../document-creative-project-delivery-package-page/document-creative-project-asset-package-send/document-creative-project-asset-package-send.component';
import { DocumentCreativeProjectSetUsageRightsComponent } from '../document-creative-project-usage-rights-page/document-creative-project-set-usage-rights/document-creative-project-set-usage-rights.component';
import { CreativeAssetAudioFormComponent, CreativeAssetImageFormComponent, CreativeAssetVideoFormComponent } from '../../../shared/global-document-form';
export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'asset-home-view',
    title: 'Asset Home',
    component: DocumentCreativeProjectAssetHomeComponent,
  },
  {
    id: 'asset-detail-view',
    title: 'Asset Detail',
    component: DocumentCreativeProjectAssetDetailComponent,
  },
  {
    id: 'modify-assets',
    title: 'Modify Assets',
    component: DocumentCreativeProjectModifyAssetsComponent,
  },
  {
    id: '3rd-import-new-request',
    title: 'Create 3rd Party Import',
    component: DocumentCreativeProjectImportNewRequestComponent,
  },
  {
    id: '3rd-import-home-view',
    title: 'Asset Home',
    component: DocumentCreativeProjectAssetHomeComponent,
  },
  {
    id: 'import-asset-page',
    title: 'Import Asset',
    component: DocumentCreativeProjectImportAssetHomeComponent,
  },
  {
    id: 'import-asset-home-view',
    title: 'Asset Home',
    component: DocumentCreativeProjectAssetHomeComponent,
  },
  {
    id: 'delivery-package',
    title: 'Create Delivery Package',
    component: DocumentCreativeProjectAssetPackageSendComponent,
  },
  {
    id: 'package-home-view',
    title: 'Asset Home',
    component: DocumentCreativeProjectAssetHomeComponent,
  },
  {
    id: 'set-usage-rights',
    title: 'Set Usage Rights',
    component: DocumentCreativeProjectSetUsageRightsComponent,
  },
  {
    id: 'App-Library-Image',
    title: 'Asset Image',
    component: CreativeAssetImageFormComponent,
  },
  {
    id: 'App-Library-Video',
    title: 'Asset Video',
    component: CreativeAssetVideoFormComponent,
  },
  {
    id: 'App-Library-Audio',
    title: 'Asset Audio',
    component: CreativeAssetAudioFormComponent,
  },
];
