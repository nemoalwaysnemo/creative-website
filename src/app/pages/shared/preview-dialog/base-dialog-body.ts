import { OnInit, OnDestroy, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { PreviewDialogService } from './preview-dialog.service';
import { Subscription } from 'rxjs';

export abstract class BaseDialogBody implements OnInit, OnDestroy {

  @Input() document: DocumentModel;

  protected onlyImg: boolean = true;
  protected onlyVideo: boolean = true;
  private subscription: Subscription = new Subscription();

  constructor(protected dialogService: PreviewDialogService) { }

  ngOnInit() {
    this.onDocumentNext();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close(): void {
    this.dialogService.close();
  }

  private onDocumentNext() {
    const subscription = this.dialogService.onDocmentNext().subscribe((res: { doc: DocumentModel, type: string }) => this.initDocument(res));
    this.subscription.add(subscription);
  }

  protected abstract initDocument(res: any);

}
