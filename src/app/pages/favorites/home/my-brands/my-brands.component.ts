import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/api/api.user.service';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService, NuxeoRequestOptions } from '@core/api';
import { TAB_CONFIG } from '../../tab-config';
@Component({
  selector: 'my-brands',
  templateUrl: './my-brands.component.html',
  styleUrls: ['./my-brands.component.scss'],
})
export class MyBrandsComponent implements OnInit {
  documents: any;
  tabs = TAB_CONFIG;
  constructor(private userService: UserService, private nuxeoApi: NuxeoApiService ) { }

  ngOnInit() {
    const subscription = this.nuxeoApi.operation( NuxeoAutomations.GetFavorite, {}, '/Creative', new NuxeoRequestOptions() )
              .subscribe((res: NuxeoPagination) => {
                this.documents = res.entries;
              });
  }

}
