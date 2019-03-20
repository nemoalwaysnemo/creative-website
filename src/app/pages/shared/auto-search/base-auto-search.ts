import { FormControl, AbstractControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { Subscription, Observable, Subject, merge } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { deepExtend } from '@core/nebular/auth/helpers';

export abstract class BaseAutoSearch implements OnInit, OnDestroy {
  protected abstract onSubmit();
  protected abstract onInit();
  protected subscription: Subscription = new Subscription();

  private $filter: Subject<any> = new Subject();
  private $keyup: Subject<any> = new Subject();
  private opt = { debounce: 300, skip: 0 };

  ngOnInit() {
    this.onInit();
    this.search();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setAutoControl(opt: { debounce?: number, skip?: number }): void {
    this.opt = deepExtend({ debounce: 300, skip: 0 }, opt);
  }

  search(): void {
    const subscription = merge(
      this.$keyup.pipe(
        debounceTime(this.opt.debounce),
        distinctUntilChanged(),
        skip(this.opt.skip),
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
