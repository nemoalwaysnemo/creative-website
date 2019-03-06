import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbDialogService } from '@core/nebular/theme';
import { PreviewDialogService } from './preview-dialog.service';
import { Subscription } from 'rxjs';
import { DocumentModel } from '@core/api';


@Component({
  selector: 'tbwa-preview-dialog',
  styleUrls: ['./preview-dialog.component.scss'],
  templateUrl: './preview-dialog.component.html',
})
export class PreviewDialogComponent implements OnInit, OnDestroy {

  type: string;

  private subscription: Subscription = new Subscription();

  constructor(private dialogService: PreviewDialogService) { }

  ngOnInit() {
    this.onDocmentNext();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private onDocmentNext() {
    const subscription = this.dialogService.onDocmentNext().subscribe((res: any) => {
      this.type = res.type;
    });
    this.subscription.add(subscription);
  }
}
