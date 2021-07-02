import { DocumentModel } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';

export class DocumentSelectListSettings {

  [key: string]: any;

  documents: DocumentModel[] = [];

  searchParams: any;

  listViewSettings: any = {};

  searchFormSettings: GlobalSearchFormSettings;

  listViewBuilder: (docs: DocumentModel[]) => DocumentListViewItem[] = (docs: DocumentModel[]) => docs.map((d: DocumentModel) => new DocumentListViewItem({
    uid: d.uid,
    title: d.title,
  }))

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
