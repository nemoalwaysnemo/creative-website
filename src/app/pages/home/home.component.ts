import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'tbwa-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnDestroy {

  private alive: boolean = true;

  constructor() {

  }

  ngOnDestroy() {
    this.alive = false;
  }
}
