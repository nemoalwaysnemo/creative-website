import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable()
export class DocumentRelatedInfoService {

  protected subject$ = new Subject<any>();

  changeTab(tabItem: any): void {
    this.subject$.next(tabItem);
  }

  onChangeTab(): Observable<any> {
    return this.subject$.pipe(share());
  }

}
