import { Component, Input, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { DocumentModel, NuxeoResponse, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentPageService } from '../../services/document-page.service';
import { SelectableActionBarSettings } from './selectable-action-bar.interface';
import { SelectableItemService, SelectableItemEvent } from '../selectable-item/selectable-item.service';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';

@Component({
  selector: 'selectable-action-bar',
  styleUrls: ['./selectable-action-bar.component.scss'],
  template: `
    <ng-container *ngIf="enabled">
      <div class='selectableBar'>
        {{count}} item(s) selected <a (click)="clear()" class="clearSelection">Clear</a>
        <div style='float:right'>
          <ng-container *ngxPermissionsOnly="['MGT']">
            <ng-container *ngIf="actionSettings.enableAddToFavorites && favoriteWritePermission$ | async">
              <a (click)="addToFavorites()">Add to favorites</a>&nbsp;&nbsp;
            </ng-container>
          </ng-container>
          <ng-container *ngIf="actionSettings.enableAddToShowcase">
            <a href="javascript:;" (click)="openDialog(showcaseDialog)" title="Add To Showcase">Add to Showcase</a>&nbsp;&nbsp;
          </ng-container>
          <ng-container *ngIf="actionSettings.enableRemoveFromShowcase">
            <a href="javascript:;" (click)="openDialog(showcaseDialog)" title="Remove from Showcase">Remove from Showcase</a>&nbsp;&nbsp;
          </ng-container>
          <ng-container *ngIf="actionSettings.enableDeleteDocuments">
            <a href="javascript:;" (click)="openDialog(deleteDialog)" title="Delete">Delete</a>
          </ng-container>
        </div>
      </div>
    </ng-container>
    <ng-template #showcaseDialog>
      <global-document-dialog [settings]="showcaseDialogSettings"[documentModel]="document" [metadata]="getShowcaseMetadata()" [title]="'Add To Showcase'"></global-document-dialog>
    </ng-template>
    <ng-template #deleteDialog>
      <global-document-dialog [settings]="deleteDialogSettings" [documentModel]="document" [title]="'Delete'"></global-document-dialog>
    </ng-template>
  `,
})

export class SelectableActionBarComponent implements OnInit, OnDestroy {

  @Input() enabled: boolean = false;

  @Input() document: DocumentModel;

  @Input()
  set settings(settings: SelectableActionBarSettings) {
    this.actionSettings = settings;
  }

  favoriteWritePermission$: Observable<boolean> = observableOf(false);

  actionSettings: SelectableActionBarSettings = new SelectableActionBarSettings();

  showcaseDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_SHOWCASE_ADD_REMOVE] });

  deleteDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETE_MULTIPLE_ASSETS] });

  count: number = 0;

  private documents: DocumentModel[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private selectableItemService: SelectableItemService,
    private documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnInit(): void {
    if (this.actionSettings.enableAddToFavorites) {
      this.getFavoriteDocument();
    }
    this.subscribeEvents();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clear(): void {
    this.selectableItemService.clear();
  }

  addToFavorites(): void {
    const uids = this.documents.map((doc: DocumentModel) => doc.uid);
    const subscription = this.documentPageService.addToFavorites(uids).subscribe((res: NuxeoResponse) => {
      if (res.entries.length > 0) {
        this.documentPageService.notify(`Added successfully!`, 'Added successfully!', 'success');
      }
    });
    this.subscription.add(subscription);
  }

  openDialog(dialog: TemplateRef<any>): void {
    if (this.documents && this.documents.length > 0) {
      this.globalDocumentDialogService.open(dialog, { documents: this.documents, closeOnBackdropClick: true });
    }
  }

  getShowcaseMetadata(): any {
    const { enableAddToShowcase, enableRemoveFromShowcase } = this.actionSettings;
    return { showcaseSettings: { enableAddToShowcase, enableRemoveFromShowcase } };
  }

  private getFavoriteDocument(): void {
    const subscription = this.documentPageService.getFavoriteDocument().subscribe((doc: DocumentModel) => {
      this.favoriteWritePermission$ = doc.hasPermission(NuxeoPermission.Write);
    });
    this.subscription.add(subscription);
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
