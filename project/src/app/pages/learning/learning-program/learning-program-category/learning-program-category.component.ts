import { Component } from '@angular/core';
import { NuxeoApiService, NuxeoAutomations } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { Subscription } from 'rxjs';

export class CategoryItem {
  readonly title: string;
  readonly uid: string;
  readonly img: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Component({
  selector: 'learning-program-category',
  styleUrls: ['./learning-program-category.component.scss'],
  templateUrl: './learning-program-category.component.html',
})
export class LearningProgramCategoryComponent extends BaseDocumentViewComponent {

  documents: any[] = [];

  categoryInfo: Map<string, string> = new Map<string, string>([
    ['Emerging Talent', 'category_emerging_talent.png'],
    ['First Time Managers', 'category_first_time_managers.png'],
    ['Rising Leaders', 'category_rising_leaders.png'],
    ['Senior Leaders', 'category_senior_leaders.png'],
    ['Executive Leaders', 'category_executive_leaders.png'],
  ]);

  constructor(
    private nuxeoApi: NuxeoApiService,
    protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.search();
  }

  private search(): void {
    const subscription = this.nuxeoApi.operation(NuxeoAutomations.DirectorySuggestEntries, { directoryName: 'App-Learning-Program-Categories' })
    .subscribe((res: any) => {
      res.map((item: any) => this.documents.push(new CategoryItem({title: this.formatTitle(item.label), uid: item.id, img: this.formatImage(item.id)})));
    });
    this.subscription.add(subscription);
  }

  formatImage(id: string): string {
    const path = '/assets/images/';
    return this.categoryInfo.has(id) ? path + this.categoryInfo.get(id) : '/assets/images/default.jpg';
  }

  formatTitle(name: string): string {
    return name.toUpperCase();
  }
}
