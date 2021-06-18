import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectAssetHomeComponent } from './document-creative-project-asset-home/document-creative-project-asset-home.component';
import { DocumentCreativeProjectAssetDetailComponent } from './document-creative-project-asset-detail/document-creative-project-asset-detail.component';
import { DocumentCreativeProjectModifyAssetsComponent } from './document-creative-project-modify-assets/document-creative-project-modify-assets.component';
import { DocumentCreativeProjectImportNewRequestComponent } from '../document-creative-project-3rd-party-import-page/document-creative-project-3rd-party-import-new-request/document-creative-project-import-new-request.component';
import { DocumentCreativeProjectImportAssetHomeComponent } from '../document-creative-project-import-asset-page/document-creative-project-import-asset-home/document-creative-project-import-asset-home.component';
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

];
