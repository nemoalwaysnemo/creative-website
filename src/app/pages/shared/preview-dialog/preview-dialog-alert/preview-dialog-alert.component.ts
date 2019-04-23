import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'preview-dialog-alert',
  styleUrls: ['./preview-dialog-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './preview-dialog-alert.component.html',
})

export class PreviewDialogAlertComponent implements OnInit {

  constructor(protected dialogService: PreviewDialogService) { }

  switch: Subject<boolean> = new Subject<boolean>();
  status: string = 'success';
  message: string = 'You have been successfully authenticated!';

  ngOnInit() {
    this.onAlertNext();
  }

  private onAlertNext(): void {
    this.dialogService.onAlertNext().subscribe((option: { switch: boolean, status?: string, message?: string }) => {
      if (option.switch) {
        this.status = option.status;
        this.message = option.message;
      }
      this.switch.next(option.switch);
    });
  }

  closeAlert() {
    this.switch.next(false);
  }
}
