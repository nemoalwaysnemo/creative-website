import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Environment } from '@environment/environment';

@Component({
  selector: 'permission-denied',
  styleUrls: ['./permission-denied.component.scss'],
  templateUrl: './permission-denied.component.html',
})
export class PermissionDeniedComponent {

  constructor(private router: Router) {
  }

  goToHome() {
    this.router.navigate([Environment.homePath]);
  }
}
