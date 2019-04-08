import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/api/api.user.service';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoAutomations, NuxeoApiService, NuxeoRequestOptions } from '@core/api';
import { TAB_CONFIG } from '../../tab-config';
@Component({
  selector: 'my-backslash',
  templateUrl: './my-backslash.component.html',
  styleUrls: ['./my-backslash.component.scss'],
})
export class MyBackslashComponent implements OnInit {
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
