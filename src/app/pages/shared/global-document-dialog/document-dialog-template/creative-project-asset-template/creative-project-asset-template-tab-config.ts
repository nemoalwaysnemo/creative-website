import { NbMenuItem } from '@core/nebular/theme';
import { CreativeProjectAssetDeliverableTemplateComponent } from './creative-project-asset-deliverable-template/creative-project-asset-deliverable-template.component';

export const TAB_CONFIG: NbMenuItem[] = [
  {
    title: 'Deliverable',
    component: CreativeProjectAssetDeliverableTemplateComponent,
  },
  {
    title: 'Import',
  },
  {
    title: '3rd Party Import',
  },
  {
    title: 'Usage Rights',
  },
  {
    title: 'ISCI',
  },
  {
    title: 'Completion Report',
  },
];
