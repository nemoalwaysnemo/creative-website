import { NbMenuItem } from '@core/nebular/theme';
import { Environment } from '@environment/environment';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Creative Library',
    icon: 'nb-creative',
    pathMatch: 'contains',
    link: '/p/creative',
    linksForMatch: ['/p/search/creative'],
    home: true,
  },
  {
    title: 'Backslash',
    icon: 'nb-backslash',
    target: '_blank',
    url: Environment.backslashAppUrl,
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
    linksForMatch: ['/p/search/intelligence'],
  },
];
