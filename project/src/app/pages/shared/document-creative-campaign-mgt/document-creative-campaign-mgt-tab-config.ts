import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeCampaignAssetPageComponent } from './document-creative-campaign-asset-page/document-creative-campaign-asset-page.component';
import { DocumentCreativeCampaignProjectsListPageComponent } from './document-creative-campaign-projects-list-page/document-creative-campaign-projects-list-page.component';
export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'campaign-asset-page',
    title: 'Assets',
    selected: true,
    component: DocumentCreativeCampaignAssetPageComponent,
  },
  {
    id: 'campaign-projects-page',
    title: 'projects',
    component: DocumentCreativeCampaignProjectsListPageComponent,
  },

];
