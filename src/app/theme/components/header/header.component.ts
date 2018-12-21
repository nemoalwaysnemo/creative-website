import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@core/nebular/theme';
import { LayoutService } from '@core/services/layout.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any;

  private alive: boolean = true;

  constructor(private menuService: NbMenuService) {
  }

  ngOnInit() {
  }

  goHome() {
    this.menuService.navigateHome();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
