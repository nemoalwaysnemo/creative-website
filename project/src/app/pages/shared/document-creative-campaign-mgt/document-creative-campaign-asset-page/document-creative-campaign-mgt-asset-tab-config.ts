import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeCampaignAssetHomeComponent } from './document-creative-campaign-asset-home/document-creative-campaign-asset-home.component';
import { CreativeProjectFormComponent, CreativeCampaignFormComponent } from '../../../shared/global-document-form';
export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'asset-home-view',
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
];
