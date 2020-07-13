import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, UserService, NuxeoResponse } from '@core/api';
import { NbToastrService } from '@core/nebular/theme';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectableItemService, SelectableItemEvent } from '../selectable-item/selectable-item.service';

@Component({
  selector: 'selectable-action-bar',
  styleUrls: ['./selectable-action-bar.component.scss'],
  template: `
    <ng-container *ngIf="enabled">
      <div style='width: 100%'>
        {{count}} item(s) selected <a (click)="clear()">Clear</a>
        <div style='float:right'>
          <a (click)="addToFavorite()">Add to favorites</a>
        </div>
      </div>
    </ng-container>
  `,
})
export class SelectableActionBarComponent implements OnInit, OnDestroy {

  @Input() enabled: boolean = false;

  count: number = 0;

  documents: any[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private selectableItemService: SelectableItemService,
    private toastrService: NbToastrService,
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
    this.selectableItemService.clear();
  }

  addToFavorite(): void {
    const uids = this.documents.map((doc: DocumentModel) => doc.uid);
    this.userService.addFavoriteDocument(uids).subscribe((res: NuxeoResponse) => {
      if (res.entries.length > 0) {
        this.toastrService.show(`Added successfully!`, '', { status: 'success' });
      }
    });
  }

  private subscribeEvents(): void {
    const subscription = this.selectableItemService.onEvent('thumbnail-view').pipe(
      map((event: SelectableItemEvent) => event.collection),
    ).subscribe((collection: DocumentModel[]) => {
      this.count = collection.length;
      this.enabled = this.count > 0;
      this.documents = collection;
    });
    this.subscription.add(subscription);
  }


}
