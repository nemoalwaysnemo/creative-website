import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tbwa-favorites',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
