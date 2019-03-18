import { OnInit, OnDestroy, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { PreviewDialogService } from './preview-dialog.service';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';

export abstract class BaseDialogBody implements OnInit, OnDestroy {

  document: DocumentModel;

  protected forDailog: boolean = true;

  protected downloadPath: string;

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

  protected parseCountry(list: string[]) {
    return list.map((x) => x.split('/').pop()).join(', ');
  }

  protected changePath (src: string) {
    return Environment.siteAssetPath + src;
  }

  private onDocumentNext() {
    const subscription = this.dialogService.onDocmentNext().subscribe((res: { doc: DocumentModel, type: string, options: any }) => {
      this.document = res.doc;
      this.downloadPath = this.document.get('file:content').data;
      this.initDocument(res);
    });
    this.subscription.add(subscription);
  }

  protected abstract initDocument(res: any);

}
