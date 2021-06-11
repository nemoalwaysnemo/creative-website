import { NbMenuItem } from '@core/nebular/theme';

export enum ASSET_TYPES {
  music = 'App-Library-UsageRights-Music',
  stock = 'App-Library-UsageRights-Stock',
  photo = 'App-Library-UsageRights-Photographer',
  talent = 'App-Library-UsageRights-Talent',
}

export const CONTRACT_YTPES = {
  'App-Library-UsageRights-Music': 'The_Loupe_Talent:Contract-Music-IDs',
  'App-Library-UsageRights-Stock': 'The_Loupe_Talent:Contract-Stock-IDs',
  'App-Library-UsageRights-Photographer': 'The_Loupe_Talent:Contract-Photographer-IDs',
  'App-Library-UsageRights-Talent': 'The_Loupe_Talent:Contract-Model-IDs',
};

export const ACTIONS: NbMenuItem[] = [
  {
    id: 'New-Talent',
    title: 'New Talent Contract',
    type: 'page',
  },
  {
    id: 'New-Music',
    title: 'New Music Contract',
    type: 'page',
  },
  {
    id: 'New-Phototgrapher',
    title: 'New Phototgrapher Contract',
    type: 'page',
  },
  {
    id: 'New-Stock',
    title: 'New Slock Contract',
    type: 'page',
  },
];
