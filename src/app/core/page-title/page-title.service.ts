import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { distinctUntilChanged } from 'rxjs/operators';
import { Environment } from '@environment/environment';

@Injectable()
export class PageTitleService {

  constructor(
    private router: Router,
    private titleService: Title,
  ) {
  }

  titleTrack(): void {
    this.router.events.pipe(
      distinctUntilChanged(),
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.titleService.setTitle(this.getTitle(event));
      }
    });
  }

  private getTitle(event: NavigationEnd): string {
    let title = this.buildPageTitle(event);
    title = title ? ` - ${title}` : '';
    return `${Environment.title}${title}`;
  }

  private buildPageTitle(event: NavigationEnd): string {
    const list = event.url.split('/p/').pop().split('/');
    const title = list.shift().split('?').shift();
    return title.charAt(0).toUpperCase() + title.substring(1);
  }

}
