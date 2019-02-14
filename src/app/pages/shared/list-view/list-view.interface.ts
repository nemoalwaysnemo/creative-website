import { deepExtend } from '@core/services';

export const LIST_VIEW_SETTINGS: any = {
  actions: null,
  attr: {
    id: 'list-view-table',
    class: 'list-view-table',
  },
};

export class ListViewSettings {

  static OptionsFactory(opts: any = {}): any {
    return deepExtend({}, LIST_VIEW_SETTINGS, opts);
  }
}

export class ListViewItem {

  [key: string]: any;
  readonly uid: string;
  readonly title: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
