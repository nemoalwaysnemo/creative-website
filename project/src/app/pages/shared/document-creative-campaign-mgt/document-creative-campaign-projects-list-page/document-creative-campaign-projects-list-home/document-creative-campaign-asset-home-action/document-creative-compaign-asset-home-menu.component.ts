import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NbMenuItem } from '@core/nebular/theme';
import { isValueEmpty } from '@core/services/helpers';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'document-creative-campaign-asset-home-menu',
  styleUrls: ['./document-creative-campaign-asset-home-menu.component.scss'],
  template: `
    <div class="document-creative-campaign-info">
      <document-creative-campaign-info [document]='document'></document-creative-campaign-info>
    </div>
    <div class="actions-title">ACTIONS</div>
    <nb-menu [items]="actions$ | async" (itemClick)="itemClick.emit($event)"></nb-menu>
  `,
})
export class DocumentCreativeCampaignAssetHomeMenuComponent {

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
