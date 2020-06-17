import { NbMenuItem } from '@core/nebular/theme';
import { CreativeProjectAssetDeliverableTemplateComponent } from './creative-project-asset-deliverable-template/creative-project-asset-deliverable-template.component';
import { CreativeProjectAssetImportLocalTemplateComponent } from './creative-project-asset-import-local-template/creative-project-asset-import-local-template.component';
import { CreativeProjectAssetImportRequestTemplateComponent } from './creative-project-asset-import-request-template/creative-project-asset-import-request-template.component';
import { CreativeProjectAssetUsageRightsTemplateComponent } from './creative-project-asset-usage-rights-template /creative-project-asset-usage-rights-template.component';
import { CreativeProjectAssetCompletionReportTemplateComponent } from './creative-project-asset-completion-report-template/creative-project-asset-completion-report-template.component';

export const TAB_CONFIG: NbMenuItem[] = [
  {
    title: 'Deliverable',
    selected: true,
    component: CreativeProjectAssetDeliverableTemplateComponent,
  },
  {
    title: 'Import',
    component: CreativeProjectAssetImportLocalTemplateComponent,
  },
  {
    title: '3rd Party Import',
    component: CreativeProjectAssetImportRequestTemplateComponent,
  },
  {
    title: 'Usage Rights',
    component: CreativeProjectAssetUsageRightsTemplateComponent,
  },
  {
    title: 'ISCI',
  },
  {
    title: 'Completion Report',
    component: CreativeProjectAssetCompletionReportTemplateComponent,
  },
];
