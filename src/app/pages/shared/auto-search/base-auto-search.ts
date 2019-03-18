import { FormControl, AbstractControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { Subscription, Observable, Subject, merge } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { deepExtend } from '@core/nebular/auth/helpers';

export abstract class BaseAutoSearch implements OnInit, OnDestroy {
  protected abstract onSubmit();
  protected abstract onInit();
  protected subscription: Subscription = new Subscription();

  private inputSubscription: Observable<any>;
  private filterSubject: Subject<any> = new Subject();


  ngOnInit() {
    this.onInit();
    this.search();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setAutoControl(control: AbstractControl, opt?: { debounce?: number, skip?: number }): void {
    opt = deepExtend({ debounce: 300, skip: 0 }, opt);
    this.inputSubscription = control.valueChanges.pipe(
      debounceTime(opt.debounce),
      distinctUntilChanged(),
      skip(opt.skip),
    );
  }

  search(): void {
    const subscription = merge(this.inputSubscription, this.filterSubject).subscribe((_: any) => {
      this.onSubmit();
    });
    this.subscription.add(subscription);
  }


  onFilterChange(aggregateModels: any): void {
    this.filterSubject.next(aggregateModels);
  }

}
