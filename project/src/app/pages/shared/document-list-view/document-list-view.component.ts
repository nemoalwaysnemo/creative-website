import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { isValueEmpty } from '@core/services/helpers';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { DocumentListViewSettings, DocumentListViewItem } from './document-list-view.interface';
import { DocumentListViewService } from './document-list-view.service';

@Component({
  selector: 'document-list-view',
  styleUrls: ['./document-list-view.component.scss'],
  templateUrl: './document-list-view.component.html',
})
export class DocumentListViewComponent implements OnInit, OnDestroy {

  options: any = {
    actions: null,
  };

  items: DocumentListViewItem[] = [];

  @Input() layout: string;

  @Input() loading: boolean;

  @Input() hide: boolean = false;

  @Input() extendRowRef: TemplateRef<any>;

  @Input()
  set documents(items: DocumentListViewItem[]) {
    if (items) {
      this.items$.next(items);
    }
  }

  @Input()
  set settings(opts: any) {
    if (opts) {
      this.settings$.next(opts);
    }
  }

  @Output() rowSelect = new EventEmitter<any>();

  private settings$: Subject<any> = new Subject<any>();

  private items$: Subject<DocumentListViewItem[]> = new Subject<DocumentListViewItem[]>();

  private subscription: Subscription = new Subscription();

  constructor(private documentListViewService: DocumentListViewService) {
    this.onDocumentChanged();
    this.onRowSelect();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onRowSelect() {
    const subscription = combineLatest([
      this.rowSelect,
      this.settings$,
    ]).subscribe(([rows, settings]: [any, any]) => {
      this.documentListViewService.onRowSelect(rows, settings);
    });
    this.subscription.add(subscription);
  }

  private onDocumentChanged(): void {
    const subscription = combineLatest([
      this.items$,
      this.settings$,
    ]).subscribe(([items, settings]: [DocumentListViewItem[], any]) => {
      this.performItems(items, settings);
    });
    this.subscription.add(subscription);
  }

  private performItems(items: DocumentListViewItem[], settings: any = {}): void {
    if (!isValueEmpty(settings.selected)) {
      this.items = items.map((i: DocumentListViewItem) => { i.isSelected = settings.selected.includes(i.uid); return i; });
      delete settings.selected;
    } else {
      this.items = items;
    }
    this.options = DocumentListViewSettings.OptionsFactory(settings);
  }

}
