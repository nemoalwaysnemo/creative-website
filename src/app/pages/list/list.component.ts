import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'tbwa-list-page',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html',
})
export class ListComponent implements OnDestroy {

  private alive: boolean = true;

  constructor() {

  }

  ngOnDestroy() {
    this.alive = false;
  }

}
