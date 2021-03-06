import { deepExtend } from '@core/services/helpers';

export const LIST_VIEW_SETTINGS: any = {
  actions: null,
  attr: {
    id: 'list-view-table',
    class: 'list-view-table',
  },
};

export class DocumentListViewSettings {

  static OptionsFactory(opts: any = {}): any {
    return deepExtend({}, LIST_VIEW_SETTINGS, opts);
  }
}

export class DocumentListViewItem {
  [key: string]: any;
  readonly uid: string;
  readonly title: string;
  isSelected: boolean = false;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
