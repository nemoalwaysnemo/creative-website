import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/api/api.user.service';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService, NuxeoRequestOptions } from '@core/api';
import { TAB_CONFIG } from '../../tab-config';
@Component({
  selector: 'tbwa-all-favorites',
  templateUrl: './all-favorites.component.html',
  styleUrls: ['./all-favorites.component.scss'],
})
export class AllFavoritesComponent {
  documents: any;
  tabs = TAB_CONFIG;
  operation_params = {
    operation_type: NuxeoAutomations.GetFavorite,
    params: {},
    input: '/Creative',
    opts: new NuxeoRequestOptions(),
  };
}
