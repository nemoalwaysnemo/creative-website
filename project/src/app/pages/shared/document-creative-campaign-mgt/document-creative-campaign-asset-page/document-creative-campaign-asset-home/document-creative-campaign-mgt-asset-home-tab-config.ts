import { NbMenuItem } from '@core/nebular/theme';
import { CreativeProjectFormComponent, CreativeCampaignFormComponent } from '../../../../shared/global-document-form';
export const TAB_CONFIG: NbMenuItem[] = [
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
