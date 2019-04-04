import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/api/api.user.service';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService } from '@core/api';
@Component({
  selector: 'tbwa-all-favorites',
  templateUrl: './all-favorites.component.html',
  styleUrls: ['./all-favorites.component.scss'],
})
export class AllFavoritesComponent implements OnInit {
  documents: any;
  tabs = [
    {
      title: 'My Favorites',
      route: '/p/favorites/all',
    },
    {
      title: 'My Brand',
      route: '/p/favorites/brands',
    },
    {
      title: 'My Backslash',
      route: '/p/favorites/backslash',
    },
    {
      title: 'My Disruption',
      route: '/p/favorites/dusruption',
    },
  ];


  constructor(private userService: UserService, private nuxeoApi: NuxeoApiService) { }

  ngOnInit() {
    const subscription = this.nuxeoApi.operation( NuxeoAutomations.GetFavorite, {}, '/Creative')
              .subscribe((res: NuxeoPagination) => {
                this.documents = res.entries;
              });
  }

}
