import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentListViewSettings, DocumentListViewItem } from './document-list-view.interface';

@Component({
  selector: 'document-list-view',
  styleUrls: ['./document-list-view.component.scss'],
  templateUrl: './document-list-view.component.html',
})
export class DocumentListViewComponent {

  options: any = {};

  items: DocumentListViewItem[] = [];

  @Input() layout: string;

  @Input() loading: boolean;

  @Input() hide: boolean = false;

  @Input() extendRowRef: TemplateRef<any>;

  @Input()
  set documents(items: DocumentListViewItem[]) {
    if (!isValueEmpty(items)) {
      this.items = items;
    }
  }

  @Input()
  set settings(opts: any) {
    if (opts) {
      this.options = DocumentListViewSettings.OptionsFactory(opts);
    }
  }

  @Output() onRowSelect = new EventEmitter<any>();

}
