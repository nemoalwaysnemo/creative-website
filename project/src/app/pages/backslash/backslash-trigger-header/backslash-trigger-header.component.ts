import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '@core/api/nuxeo/lib/nuxeo.user-model';
import { DocumentPageService } from '@pages/shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'backslash-trigger-header',
  styleUrls: ['./backslash-trigger-header.component.scss'],
  templateUrl: './backslash-trigger-header.component.html',
})
export class BackslashTriggerHeaderComponent implements OnInit, OnDestroy {

  user: any = {};

  private subscription: Subscription = new Subscription();

  constructor(protected documentPageService: DocumentPageService) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getUser(): void {
    const subscription = this.documentPageService.getCurrentUser().subscribe((user: UserModel) => {
      this.user = user;
    });
    this.subscription.add(subscription);
  }

}
