import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@core/nebular/theme';
@Component({
  selector: 'knowledge-pages',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class KnowledgePageComponent implements OnInit {
  constructor( protected sidebarService: NbSidebarService ) {}
  ngOnInit() {
    this.sidebarService.closeAllBars(true);
  }
}
