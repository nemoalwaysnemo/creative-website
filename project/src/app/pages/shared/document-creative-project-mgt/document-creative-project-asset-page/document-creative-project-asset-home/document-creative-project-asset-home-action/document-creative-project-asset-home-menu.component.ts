import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NbMenuItem } from '@core/nebular/theme';
import { isValueEmpty } from '@core/services/helpers';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'document-creative-project-asset-home-menu',
  styleUrls: ['./document-creative-project-asset-home-menu.component.scss'],
  template: `
    <div class="actions-title">ACTIONS</div>
    <nb-menu [items]="actions$ | async" (itemClick)="itemClick.emit($event)"></nb-menu>
    <div class="document-creative-project-info">
      <document-creative-project-info [document]='document'></document-creative-project-info>
    </div>
  `,
})
export class DocumentCreativeProjectAssetHomeMenuComponent {

  @Input() document: DocumentModel;

  actions$: Subject<NbMenuItem[]> = new BehaviorSubject<NbMenuItem[]>([]);

  @Input()
  set items(items: any) {
    if (!isValueEmpty(items)) {
      this.actions$.next(items);
    }
  }
  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}
}
