import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NbSidebarService } from '@core/nebular/theme';
import { StateService } from '@core/services/state.service';

@Component({
  selector: 'library-ui-layout',
  styleUrls: ['./library-ui.layout.scss'],
  template: `
    <nb-layout [center]="layout.id === 'center-column'" windowMode>

      <nb-layout-header *ngIf="!hideHeader" fixed>
        <library-ui-header></library-ui-header>
      </nb-layout-header>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

    </nb-layout>
  `,
})
export class LibraryLayoutComponent implements OnInit, OnDestroy {

  protected destroy$ = new Subject<void>();

  layout: any = {};

  hideHeader: boolean = false;

  constructor(private stateService: StateService, private sidebarService: NbSidebarService) {
    this.sidebarService.onHideAllBarsonSidebar()
      .subscribe((data: { close: boolean }) => {
        this.hideHeader = data.close;
      });
  }

  ngOnInit(): void {
    this.stateService.onLayoutState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(layout => this.layout = layout);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
