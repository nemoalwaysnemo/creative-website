import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeCampaignAssetPageComponent } from './document-creative-campaign-asset-page/document-creative-campaign-asset-page.component';

export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'campaign-asset-page',
    title: 'Assets',
    selected: true,
    component: DocumentCreativeCampaignAssetPageComponent,
  },

];
