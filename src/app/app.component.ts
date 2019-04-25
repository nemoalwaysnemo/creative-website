import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics';
import { PageTitleService } from '@core/page-title';

@Component({
  selector: 'tbwa-gcl',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private pageTitleService: PageTitleService,
    private googleAnalytics: GoogleAnalyticsService) {
  }

  ngOnInit(): void {
    this.pageTitleService.titleTrack();
    this.googleAnalytics.pageTrack();
  }

}
