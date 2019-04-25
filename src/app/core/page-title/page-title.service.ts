import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { distinctUntilChanged } from 'rxjs/operators';
import { Environment } from '@environment/environment';
import { isDocumentUID } from '@core/services/helpers';

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
    const title = this.buildPageTitle(event);
    return `${Environment.title} - ${title}`;
  }

  private buildPageTitle(event: NavigationEnd): string {
    const list = event.url.split('/p/').pop().split('/');
    const title = list.shift();
    // const title = list.filter(x => !isDocumentUID(x)).join(' ');
    return title.charAt(0).toUpperCase() + title.substring(1);
  }

}
