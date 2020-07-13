import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SelectableItemService } from '../selectable-item/selectable-item.service';
import { DocumentModel, UserService } from '@core/api';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'selectable-action-bar',
  template: `
    <div style='width: 100%'>
      {{count}} item(s) selected <a (click)="clear()">Clear</a>
      <div style='float:right'>
        <a (click)="clickActionOne()">action 1</a>
        <a>action 2</a>
        <a>action 3</a>
      </div>
    </div>
  `,
  styleUrls: ['./selectable-action-bar.component.scss'],
})
export class SelectableActionBarComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  count: number = 0;

  documents: any[] = [];

  constructor(
    private selectableItemService: SelectableItemService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clear(): void {
    console.log('clear');
    this.selectableItemService.clear();
  }

  private clickActionOne(): void {
    this.userService.addFavoriteDocument(this.documents).subscribe(p => {
      console.log(p);
    });
  }

  private subscribeEvents(): void {
    const subscription = this.selectableItemService.onEvent('thumbnail-view').pipe(
      map(res => res.collection),
    ).subscribe(collection => {
      this.count = collection.length;
      const ids = collection.map(doc => doc.uid);
      this.documents = ids;
      // this.documents = collection;
    });
    this.subscription.add(subscription);
  }


}
