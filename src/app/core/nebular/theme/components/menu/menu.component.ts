/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostBinding,
  AfterViewInit,
  Inject,
  DoCheck,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { takeWhile, filter, map } from 'rxjs/operators';
import { NbMenuInternalService, NbMenuItem, NbMenuBag, NbMenuService } from './menu.service';
import { convertToBoolProperty } from '../helpers';
import { NB_WINDOW } from '../../theme.options';
import { animate, state, style, transition, trigger } from '@angular/animations';

export enum NbToggleStates {
  Expanded = 'expanded',
  Collapsed = 'collapsed',
}

@Component({
  selector: '[nbMenuItem]',
  templateUrl: './menu-item.component.html',
  animations: [
    trigger('toggle', [
      state(NbToggleStates.Collapsed, style({ height: '0' })),
      state(NbToggleStates.Expanded, style({ height: '*' })),
      transition(`${NbToggleStates.Collapsed} <=> ${NbToggleStates.Expanded}`, animate(300)),
    ]),
  ],
})
export class NbMenuItemComponent implements DoCheck, AfterViewInit, OnDestroy {
  @Input() menuItem = <NbMenuItem>null;

  @Output() hoverItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleSubMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();

  private alive = true;
  toggleState: NbToggleStates;

  constructor(private menuService: NbMenuService) { }

  ngDoCheck(): void {
    this.toggleState = this.menuItem.expanded ? NbToggleStates.Expanded : NbToggleStates.Collapsed;
  }

  ngAfterViewInit(): void {
    this.menuService.onSubmenuToggle()
      .pipe(
        takeWhile(() => this.alive),
        filter(({ item }) => item === this.menuItem),
        map(({ item }: NbMenuBag) => item.expanded),
      )
      .subscribe(isExpanded => this.toggleState = isExpanded ? NbToggleStates.Expanded : NbToggleStates.Collapsed);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onToggleSubMenu(item: NbMenuItem): void {
    this.toggleSubMenu.emit(item);
  }

  onHoverItem(item: NbMenuItem): void {
    this.hoverItem.emit(item);
  }

  onSelectItem(item: NbMenuItem): void {
    this.selectItem.emit(item);
  }

  onItemClick(item: NbMenuItem): void {
    this.itemClick.emit(item);
  }
}

/**
 * Vertical menu component.
 *
 * Accepts a list of menu items and renders them accordingly. Supports multi-level menus.
 *
 * Basic example
 * @stacked-example(Showcase, menu/menu-showcase.component)
 *
 * ```ts
 * // ...
 * items: NbMenuItem[] = [
 *  {
 *    title: home,
 *    link: '/'
 *  },
 *  {
 *    title: dashboard,
 *    link: 'dashboard'
 *  }
 * ];
 * // ...
 * <nb-menu [items]="items"></nb-menu>
 * ```
 * ### Installation
 *
 * Import `NbMenuModule.forRoot()` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *   	// ...
 *     NbMenuModule.forRoot(),
 *   ],
 * })
 * export class AppModule { }
 * ```
 * and `NbMenuModule` to your feature module where the component should be shown:
 * ```ts
 * @NgModule({
 *   imports: [
 *   	// ...
 *     NbMenuModule,
 *   ],
 * })
 * export class PageModule { }
 * ```
 * ### Usage
 *
 * Two-level menu example
 * @stacked-example(Two Levels, menu/menu-children.component)
 *
 *
 * Autocollapse menu example
 * @stacked-example(Autocollapse Menu, menu/menu-autocollapse.component)
 *
 *
 * @styles
 *
 * menu-font-family:
 * menu-font-size:
 * menu-font-weight:
 * menu-fg:
 * menu-bg:
 * menu-active-fg:
 * menu-active-bg:
 * menu-active-font-weight:
 * menu-submenu-bg:
 * menu-submenu-fg:
 * menu-submenu-active-fg:
 * menu-submenu-active-bg:
 * menu-submenu-active-border-color:
 * menu-submenu-active-shadow:
 * menu-submenu-hover-fg:
 * menu-submenu-hover-bg:
 * menu-submenu-item-border-width:
 * menu-submenu-item-border-radius:
 * menu-submenu-item-padding:
 * menu-submenu-item-container-padding:
 * menu-submenu-padding:
 * menu-group-font-weight:
 * menu-group-font-size:
 * menu-group-fg:
 * menu-group-padding
 * menu-item-padding:
 * menu-item-separator:
 * menu-icon-font-size:
 * menu-icon-margin:
 * menu-icon-color:
 * menu-icon-active-color:
 */
@Component({
  selector: 'nb-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
    <ul class="menu-items">
      <ng-container *ngFor="let item of items">
        <li nbMenuItem *ngIf="!item.hidden"
            [class.active]="item.selected"
            [menuItem]="item"
            [class.menu-group]="item.group"
            (hoverItem)="onHoverItem($event)"
            (toggleSubMenu)="onToggleSubMenu($event)"
            (selectItem)="onSelectItem($event)"
            (itemClick)="onItemClick($event)"
            class="menu-item">
        </li>
      </ng-container>
    </ul>
  `,
})
export class NbMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  @HostBinding('class.inverse') inverseValue: boolean;

  /**
   * Tags a menu with some ID, can be later used in the menu service
   * to determine which menu triggered the action, if multiple menus exist on the page.
   *
   * @type {string}
   */
  @Input() tag: string;

  /**
   * List of menu items.
   * @type List<NbMenuItem> | List<any> | any
   */
  @Input() items: NbMenuItem[];

  /**
   * Makes colors inverse based on current theme
   * @type boolean
   */
  @Input()
  set inverse(val: boolean) {
    this.inverseValue = convertToBoolProperty(val);
  }

  /**
   * Collapse all opened submenus on the toggle event
   * Default value is "false"
   * @type boolean
   */
  @Input()
  set autoCollapse(val: boolean) {
    this.autoCollapseValue = convertToBoolProperty(val);
  }

  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();

  private alive: boolean = true;

  private autoCollapseValue: boolean = false;

  constructor(@Inject(NB_WINDOW) private window, private menuInternalService: NbMenuInternalService, private router: Router) {
  }

  ngOnInit(): void {
    this.menuInternalService.prepareItems(this.items);

    this.menuInternalService
      .onAddItem()
      .pipe(
        takeWhile(() => this.alive),
        filter((data: { tag: string; items: NbMenuItem[] }) => this.compareTag(data.tag)),
      )
      .subscribe(data => this.onAddItem(data));

    this.menuInternalService
      .onNavigateHome()
      .pipe(
        takeWhile(() => this.alive),
        filter((data: { tag: string; items: NbMenuItem[] }) => this.compareTag(data.tag)),
      )
      .subscribe(() => this.navigateHome());

    this.menuInternalService
      .onGetSelectedItem()
      .pipe(
        takeWhile(() => this.alive),
        filter((data: { tag: string; listener: BehaviorSubject<NbMenuBag> }) => this.compareTag(data.tag)),
      )
      .subscribe((data: { tag: string; listener: BehaviorSubject<NbMenuBag> }) => {
        data.listener.next({ tag: this.tag, item: this.getSelectedItem(this.items) });
      });

    this.menuInternalService
      .onCollapseAll()
      .pipe(
        takeWhile(() => this.alive),
        filter((data: { tag: string }) => this.compareTag(data.tag)),
      )
      .subscribe(() => this.collapseAll());

    this.router.events
      .pipe(
        takeWhile(() => this.alive),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        this.menuInternalService.selectFromUrl(this.items, this.tag, this.autoCollapseValue);
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.menuInternalService.selectFromUrl(this.items, this.tag, this.autoCollapseValue));
  }

  onAddItem(data: { tag: string; items: NbMenuItem[] }): void {
    this.items.push(...data.items);

    this.menuInternalService.prepareItems(this.items);
    this.menuInternalService.selectFromUrl(this.items, this.tag, this.autoCollapseValue);
  }

  onHoverItem(item: NbMenuItem): void {
    this.menuInternalService.itemHover(item, this.tag);
  }

  onToggleSubMenu(item: NbMenuItem): void {
    if (this.autoCollapseValue) {
      this.menuInternalService.collapseAll(this.items, this.tag, item);
    }
    item.expanded = !item.expanded;
    this.menuInternalService.submenuToggle(item, this.tag);
  }

  // TODO: is not fired on page reload
  onSelectItem(item: NbMenuItem): void {
    this.menuInternalService.selectItem(item, this.items, this.autoCollapseValue, this.tag);
  }

  onItemClick(item: NbMenuItem): void {
    this.setItemActive(item);
    this.itemClick.emit(item);
    this.menuInternalService.itemClick(item, this.tag);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private setItemActive(item: NbMenuItem): void {
    this.setItemsInActive(this.items);
    item.selected = true;
  }

  private setItemsInActive(items: NbMenuItem[]): void {
    items.forEach((i: NbMenuItem) => {
      i.selected = false;
      if (i.children && i.children.length > 0) {
        this.setItemsInActive(i.children);
      }
    });
  }

  private navigateHome(): void {
    const homeItem = this.getHomeItem(this.items);

    if (homeItem) {
      if (homeItem.link) {
        this.router.navigate([homeItem.link], { queryParams: homeItem.queryParams, fragment: homeItem.fragment });
      }

      if (homeItem.url) {
        this.window.location.href = homeItem.url;
      }
    }
  }

  private collapseAll(): void {
    this.menuInternalService.collapseAll(this.items, this.tag);
  }

  private getHomeItem(items: NbMenuItem[]): NbMenuItem {
    for (const item of items) {
      if (item.home) {
        return item;
      }

      const homeItem = item.children && this.getHomeItem(item.children);
      if (homeItem) {
        return homeItem;
      }
    }
  }

  private compareTag(tag: string): boolean {
    return !tag || tag === this.tag;
  }

  private getSelectedItem(items: NbMenuItem[]): NbMenuItem {
    let selected = null;
    items.forEach((item: NbMenuItem) => {
      if (item.selected) {
        selected = item;
      }
      if (item.selected && item.children && item.children.length > 0) {
        selected = this.getSelectedItem(item.children);
      }
    });
    return selected;
  }
}
