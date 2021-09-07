import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectAssetPageComponent } from '@pages/shared/document-creative-project-mgt/document-creative-project-asset-page/document-creative-project-asset-page.component';
import { CreativeProjectFormComponent, CreativeCampaignFormComponent } from '../../../global-document-form';
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
  {
    id: 'project-asset-page',
    title: 'Assets',
    component: DocumentCreativeProjectAssetPageComponent,
  },
];
