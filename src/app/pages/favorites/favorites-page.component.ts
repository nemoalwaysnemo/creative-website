import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tbwa-favorites',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./favorites-page.component.scss'],
})
export class FavoritesPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
