import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectAssetHomeComponent } from './document-creative-project-asset-home/document-creative-project-asset-home.component';
import { DocumentCreativeProjectAssetDetailComponent } from './document-creative-project-asset-detail/document-creative-project-asset-detail.component';

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
];
