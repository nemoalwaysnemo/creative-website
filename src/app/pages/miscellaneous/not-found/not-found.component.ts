import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Environment } from '@environment/environment';

@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  constructor(private router: Router) {
  }

  goToHome() {
    this.router.navigate([Environment.homePath]);
  }
}
