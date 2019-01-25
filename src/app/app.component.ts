import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@core/nebular/theme';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { withLatestFrom, filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  themes = ['default', 'cosmic', 'corporate'];

  constructor(
    private googleTagManager: Angulartics2GoogleTagManager,
    private activatedRoute: ActivatedRoute,
    private themeService: NbThemeService,
  ) {
    this.googleTagManager.startTracking();
    this.activatedRoute.queryParams
      .subscribe((params: any) => {
        if (params.theme && this.themes.includes(params.theme)) {
          this.themeService.changeTheme(params.theme);
        }
      });
  }

  ngOnInit(): void {

  }
}
