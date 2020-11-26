import { Component, Input } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoPagination } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { Subscription } from 'rxjs';

class Light {
  message: string;
  date: Date;
  style: string;

  constructor(message: any, date: any, style: string) {
    this.message = message;
    this.date = date;
    this.style = style;
  }
}

@Component({
  selector: 'document-usage-rights-status',
  templateUrl: './document-usage-rights-status.component.html',
  styleUrls: ['./document-usage-rights-status.component.scss'],
})
export class DocumentUsageRightsStatusComponent {

  @Input()
  set document(doc: DocumentModel) {
    this.getUsageRightsStatus(doc);
  }

  private subscription: Subscription = new Subscription();

  usageRights: any = {};

  lights: Light[] = [new Light('no', null, 'no  '), new Light('no', null, 'no  ')];

  constructor(
    private documentPageService: DocumentPageService,
  ) { }

  private getUsageRightsStatus(doc: DocumentModel): void {
    const subscription = this.documentPageService.operation(NuxeoAutomations.GetDocumentURStatus, { uuids: doc.uid, entityType: 'asset' })
      .subscribe((res: NuxeoPagination) => {
        this.usageRights = res.entries.shift();
        this.buildLightList();
      });
    this.subscription.add(subscription);
  }

  hasUsageRight(): boolean {
    return !!this.usageRights;
  }

  buildLightList(): void {
    if (this.hasUsageRight()) {
      this.lights = [];
      this.lights.push(this.buildLight(this.usageRights.MUSIC));
      this.lights.push(this.buildLight(this.usageRights.MODEL));
      this.lights.push(this.buildLight(this.usageRights.PHOTO));
      this.lights.push(this.buildLight(this.usageRights.STOCK));
    }
  }

  buildLight(contract: any): Light {
    let message: any, date: any, style: string;
    if (contract.info_messages.length > 0) {
      message = contract.info_messages;
      style = 'error';
    } else {
      message = contract.days_left;
      if (!!contract.end_date) {
        date = new Date(contract.end_date);
      }
      style = parseInt(message, 10) > 0 ? 'info' : 'waring';
    }
    return new Light(message, date, style);
  }
}
