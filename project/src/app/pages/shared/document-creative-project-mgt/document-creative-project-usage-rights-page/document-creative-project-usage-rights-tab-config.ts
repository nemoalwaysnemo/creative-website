import { NbMenuItem } from '@core/nebular/theme';
import { DocumentCreativeProjectUsageRightHomeComponent } from './document-creative-project-usage-rights-home/document-creative-project-usage-rights-home.component';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';

export const TAB_CONFIG: NbMenuItem[] = [
  {
    id: 'usage-rights-home-view',
    title: 'Asset Home',
    component: DocumentCreativeProjectUsageRightHomeComponent,
  },
  {
    id: 'New-Talent',
    title: 'New Model Contract',
    component: GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_MODEL_FORM,
  },
  {
    id: 'New-Music',
    title: 'New Music Contract',
    component: GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_MUSIC_FORM,
  },
  {
    id: 'New-Phototgrapher',
    title: 'New Photo Contract',
    component: GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_PHOTO_FORM,
  },
  {
    id: 'New-Stock',
    title: 'New Stock Contract',
    component: GLOBAL_DOCUMENT_FORM.CREATIVE_USAGE_RIGHTS_STOCK_FORM,
  },
];
