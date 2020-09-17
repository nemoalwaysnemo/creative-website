import { Component, Input, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { DocumentModel, UserService, NuxeoResponse } from '@core/api';
import { NbToastrService } from '@core/nebular/theme';
import { map } from 'rxjs/operators';
import { SelectableItemService, SelectableItemEvent } from '../selectable-item/selectable-item.service';
import { Observable, of as observableOf, forkJoin, Subscription } from 'rxjs';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../global-document-dialog';
import { DocumentPageService } from '../services/document-page.service';
import { GLOBAL_DOCUMENT_FORM } from '../global-document-form';
import { NUXEO_DOC_TYPE } from '@environment/environment';


@Component({
  selector: 'selectable-action-bar',
  styleUrls: ['./selectable-action-bar.component.scss'],
  template: `
    <ng-container *ngIf="enabled">
      <div class='selectableBar'>
        {{count}} item(s) selected <a (click)="clear()" class="clearSelection">Clear</a>
        <div style='float:right'>
          <a (click)="addToFavorite()">Add to favorites</a>
          &nbsp;&nbsp;
          <a href="javascript:;" (click)="openDialog(showcaseDialog)" title="Add To Showcase">Add to Showcase</a>
          &nbsp;&nbsp;
          <ng-container>
            <a href="javascript:;" (click)="openDialog(deleteDialog)" title="Delete">Delete</a>
          </ng-container>
        </div>
      </div>
    </ng-container>
    <ng-template #showcaseDialog>
      <global-document-dialog [settings]="showcaseDialogSettings" [metadata]="showcaseMetadata" [documentModel]="document" [title]="showcaseTitle"></global-document-dialog>
    </ng-template>
    <ng-template #deleteDialog>
      <global-document-dialog [settings]="deleteDialogSettings" [documentModel]="document" [metadata]="dialogMetadata" [title]="deleteTitle"></global-document-dialog>
    </ng-template>
  `,
})

export class SelectableActionBarComponent implements OnInit, OnDestroy {

  @Input() enabled: boolean = false;

  @Input() document: DocumentModel;

  showcaseTitle: string = 'Add To Showcase';

  deleteTitle: string = 'Delete';

  showcaseDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.SHOWCASE_ADD_REMOVE] });

  deleteDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION] });

  showcaseMetadata: any = {
    addShowcase: true,
  };

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    enableDeletion: true,
  };

  count: number = 0;

  private documents: DocumentModel[] = [];

  private subscription: Subscription = new Subscription();

  constructor(
    private selectableItemService: SelectableItemService,
    private toastrService: NbToastrService,
    private userService: UserService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
    private documentPageService: DocumentPageService,
  ) { }

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

  openDialog(dialog: TemplateRef<any>, closeOnBackdropClick: boolean = true): void {
    if (this.documents && this.documents.length > 0) {
      this.globalDocumentDialogService.open(dialog, { documents: this.documents, closeOnBackdropClick: closeOnBackdropClick, metadata: this.showcaseMetadata });
    }
  }

}
