import { NbMenuItem } from '@core/nebular/theme';
import { Environment } from '@environment/environment';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Creative Library',
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
  {
    title: 'Disruption',
    icon: 'nb-disruption',
    pathMatch: 'contains',
    link: '/p/disruption',
  },
  {
    title: 'Intelligence',
    icon: 'nb-intelligence',
    pathMatch: 'contains',
    link: '/p/intelligence',
  },
];
