import { NbMenuItem } from '@core/nebular/theme';
import { Environment } from '@environment/environment';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Library',
    icon: 'nb-creative',
    link: '/p/creative',
    pathMatch: 'contains',
    home: true,
  },
  {
    title: 'Backslash',
    icon: 'nb-backslash',
    url: Environment.backslashAPPUrl,
  },
];
