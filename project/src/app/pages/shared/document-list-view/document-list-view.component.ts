import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentListViewSettings, DocumentListViewItem } from './document-list-view.interface';

@Component({
  selector: 'document-list-view',
  styleUrls: ['./document-list-view.component.scss'],
  templateUrl: './document-list-view.component.html',
})
export class DocumentListViewComponent {

  options: any = {};

  @Input() layout: string;

  @Input() loading: boolean;

  @Input() hide: boolean = false;

  @Input() documents: DocumentListViewItem[];

  @Input()
  set settings(opts: any) {
    if (opts) {
      this.options = DocumentListViewSettings.OptionsFactory(opts);
    }
  }

  @Output() onRowSelect = new EventEmitter<any>();

}