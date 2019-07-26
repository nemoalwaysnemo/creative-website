import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbSidebarService } from '@core/nebular/theme';
@Component({
  selector: 'knowledge-pages',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class KnowledgePageComponent implements OnInit, OnDestroy {

  constructor(protected sidebarService: NbSidebarService) { }

  ngOnInit() {
    this.sidebarService.closeAllBars(true);
  }

  ngOnDestroy() {
    this.sidebarService.closeAllBars(false);
  }
}
