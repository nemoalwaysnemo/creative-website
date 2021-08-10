import { Component, Input } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoPagination } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { Subscription } from 'rxjs';

class Light {
  message: string;
  date: Date;
  style: string;
  type: string;

  constructor(message: any, date: any, style: string, type: string) {
    this.message = message;
    this.date = date;
    this.style = style;
    this.type = type;
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

  lights: Light[] = [new Light('no', null, 'no  ', ''), new Light('no', null, 'no  ', '')];

  urList: Map<string, string> = new Map<string, string>([
    ['App-Library-UsageRights-Talent', 'Talent'],
    ['App-Library-UsageRights-Music', 'Music'],
    ['App-Library-UsageRights-Photographer', 'Photographer'],
    ['App-Library-UsageRights-Stock', 'Stock'],
  ]);

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
      this.lights.push(this.buildLight(this.usageRights.MODEL, 'Talent'));
      this.lights.push(this.buildLight(this.usageRights.MUSIC, 'Music'));
      this.lights.push(this.buildLight(this.usageRights.PHOTO, 'Photographer'));
      this.lights.push(this.buildLight(this.usageRights.STOCK, 'Stock'));
    }
  }

  buildLight(contract: any, type: string): Light {
    let message: any, date: any, style: string;
    if (contract.info_messages.length > 0) {
      message = contract.info_messages;
      style = 'warning';
    } else {
      message = contract.days_left;
      if (!!contract.end_date) {
        date = new Date(contract.end_date);
      }
      style = this.getExpiredType(message);
    }
    // type = this.urList.get(contract.doc_type);
    return new Light(message, date, style, type);
  }

  getExpiredType(left: string): string {
    const daysLeft = parseInt(left, 10);
    if (daysLeft > 90) {
      return 'notExpired';
    } else if (daysLeft > 30) {
      return 'expiring';
    } else if (daysLeft > 0) {
      return 'expiringSoon';
    } else if (daysLeft <= 0) {
      return 'expired';
    } else {
      return 'warning';
    }
  }
}
