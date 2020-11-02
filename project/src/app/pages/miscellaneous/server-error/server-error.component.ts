import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Environment } from '@environment/environment';

@Component({
  selector: 'server-error',
  styleUrls: ['./server-error.component.scss'],
  templateUrl: './server-error.component.html',
})
export class ServerErrorComponent {

  constructor(private router: Router) {
  }

  goHome(): void {
    this.router.navigate([Environment.homePath]);
  }
}
