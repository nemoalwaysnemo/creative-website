import { Injectable, OnDestroy } from '@angular/core';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class StateService implements OnDestroy {

  protected layouts: any = [
    {
      name: 'Two Column',
      icon: 'nb-layout-two-column',
      id: 'two-column',
    },
    {
      name: 'Center Column',
      icon: 'nb-layout-centre',
      id: 'center-column',
    },
  ];

  protected sidebars: any = [
    {
      name: 'Sidebar at layout start',
      icon: 'nb-layout-sidebar-left',
      id: 'start',
      selected: true,
    },
  ];

  protected layoutState$ = new BehaviorSubject(this.layouts[0]);
  protected sidebarState$ = new BehaviorSubject(this.sidebars[0]);

  private alive: boolean = true;

  constructor() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  setLayoutState(state: any): any {
    this.layoutState$.next(state);
  }

  getLayoutStates(): Observable<any[]> {
    return observableOf(this.layouts);
  }

  onLayoutState(): Observable<any> {
    return this.layoutState$.asObservable();
  }

  setSidebarState(state: any): any {
    this.sidebarState$.next(state);
  }

  getSidebarStates(): Observable<any[]> {
    return observableOf(this.sidebars);
  }

  onSidebarState(): Observable<any> {
    return this.sidebarState$.asObservable();
  }
}
