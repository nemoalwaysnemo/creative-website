import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { Subscription, Subject, merge } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { deepExtend } from '@core/nebular/auth/helpers';

export abstract class BaseAutoSearch implements OnInit, OnDestroy {
  protected abstract onSubmit();
  protected abstract onInit();
  protected subscription: Subscription = new Subscription();

  private $filter: Subject<any> = new Subject();
  private $keyup: Subject<any> = new Subject();
  private settings = { debounce: 500, skip: 0 };

  ngOnInit() {
    this.onInit();
    this._subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setAutoControl(settings: { debounce?: number, skip?: number }): void {
    this.settings = deepExtend({}, this.settings, settings);
  }

  private _subscribe(): void {
    const subscription = merge(
      this.$keyup.pipe(
        debounceTime(this.settings.debounce),
        distinctUntilChanged(),
        skip(this.settings.skip),
      ),
      this.$filter,
    ).subscribe((_: any) => {
      this.onSubmit();
    });
    this.subscription.add(subscription);
  }

  onKeyup(_: any): void {
    this.$keyup.next(_);
  }

  onFilterChange(_: any): void {
    this.$filter.next(_);
  }

}
