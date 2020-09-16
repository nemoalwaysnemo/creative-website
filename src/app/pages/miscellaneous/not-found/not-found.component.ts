import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Environment } from '@environment/environment';

@Component({
  selector: 'page-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  constructor(private router: Router) {
  }

  goHome(): void {
    this.router.navigate([Environment.homePath]);
  }
}
