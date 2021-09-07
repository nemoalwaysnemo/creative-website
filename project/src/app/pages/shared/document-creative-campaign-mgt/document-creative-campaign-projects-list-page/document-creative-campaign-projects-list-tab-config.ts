import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeCampaignAssetHomeComponent } from '../document-creative-campaign-asset-page/document-creative-campaign-asset-home/document-creative-campaign-asset-home.component';
import { CreativeProjectFormComponent, CreativeCampaignFormComponent } from '../../global-document-form';
import { DocumentCreativeCampaignProjectsListHomeComponent } from './document-creative-campaign-projects-list-home/document-creative-campaign-projects-list-home.component';
import { DocumentCreativeProjectAssetPageComponent } from '@pages/shared/document-creative-project-mgt/document-creative-project-asset-page/document-creative-project-asset-page.component';
export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'campaign-asset-home-view',
    title: 'Asset Home',
    component: DocumentCreativeCampaignAssetHomeComponent,
  },
  {
    id: 'create-new-project',
    title: 'Create New Project',
    component: CreativeProjectFormComponent,
  },
  {
    id: 'edit-campaign',
    title: 'Edit Campaign',
    component: CreativeCampaignFormComponent,
  },
  {
    id: 'project-list-home',
    title: 'Project List',
    component: DocumentCreativeCampaignProjectsListHomeComponent,
  },
  {
    id: 'project-asset-page',
    title: 'Assets',
    component: DocumentCreativeProjectAssetPageComponent,
  },
];
