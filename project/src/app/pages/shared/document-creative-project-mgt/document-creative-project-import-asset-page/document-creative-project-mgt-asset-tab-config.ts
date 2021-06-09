import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectImportAssetHomeComponent } from './document-creative-project-import-asset-home/document-creative-project-import-asset-home.component';
import { DocumentCreativeProjectAssetHomeComponent } from '..//document-creative-project-asset-page/document-creative-project-asset-home/document-creative-project-asset-home.component';
export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'import-asset-home-view',
    title: 'Asset Home',
    component: DocumentCreativeProjectImportAssetHomeComponent,
  },
  {
    id: 'asset-home-view',
    title: 'Asset Home',
    component: DocumentCreativeProjectAssetHomeComponent,
  },
];
