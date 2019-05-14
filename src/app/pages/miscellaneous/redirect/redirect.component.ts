import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'redirect',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class RedirectComponent {
}

@Component({
  selector: 'redirect-body',
  template: '',
})
export class RedirectBodyComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(
      map(params => params.url),
    ).subscribe(url => {
      this.router.navigate([url]);
    });
  }
}
