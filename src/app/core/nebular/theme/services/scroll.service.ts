import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import { share } from 'rxjs/operators';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

/**
 * Scroll position type
 */
export interface NbScrollPosition {

  /**
   * x - left
   * @type {number}
   */
  x: number;

  /**
   * y - top
   * @type {number}
   */
  y: number;
}

/**
 * Layout scroll service. Provides information about current scroll position,
 * as well as methods to update position of the scroll.
 *
 * The reason we added this service is that in Nebular there are two scroll modes:
 * - the default mode when scroll is on body
 * - and the `withScroll` mode, when scroll is removed from the body and moved to an element inside of the
 * `nb-layout` component
 */
@Injectable()
export class NbLayoutScrollService {
  constructor(private _scrollToService: ScrollToService) { }

  public triggerScrollTo(destination: string) {
    const config: ScrollToConfigOptions = {
      target: destination,
      duration: 300,
      offset: -129,
    };

    this._scrollToService.scrollTo(config);
  }
  private scrollPositionReq$ = new Subject<any>();
  private manualScroll$ = new Subject<NbScrollPosition>();
  private scroll$ = new Subject<any>();
  private scrollable$ = new Subject<boolean>();
  private scrollListening$ = new Subject<any>();
  /**
   * Returns scroll position
   *
   * @returns {Observable<NbScrollPosition>}
   */
  getPosition(): Observable<NbScrollPosition> {
    return Observable.create((observer: Subscriber<NbScrollPosition>) => {
      const listener = new Subject<NbScrollPosition>();
      listener.subscribe(observer);
      this.scrollPositionReq$.next({ listener });

      return () => listener.complete();
    });
  }

  /**
   * Sets scroll position
   *
   * @param {number} x
   * @param {number} y
   */
  scrollTo(x: number = null, y: number = null) {
    this.manualScroll$.next({ x, y });
  }

  /**
   * Returns a stream of scroll events
   *
   * @returns {Observable<any>}
   */
  onScroll() {
    return this.scroll$.pipe(share<any>());
  }

  /**
   * Returns a tag to stop scroll listening
   *
   * @returns {Observable<any>}
   */
  onScrollListen(): Observable<{ stop: any }> {
    return this.scrollListening$.pipe(share<any>());
  }

  /**
   * @private
   * @returns Observable<NbScrollPosition>.
   */
  onManualScroll(): Observable<NbScrollPosition> {
    return this.manualScroll$.pipe(share<NbScrollPosition>());
  }

  /**
   * @private
   * @returns {Subject<any>}
   */
  onGetPosition(): Subject<any> {
    return this.scrollPositionReq$;
  }

  onScrollableChange(): Observable<boolean> {
    return this.scrollable$.pipe(share());
  }

  /**
   * @private
   * @param {any} event
   */
  fireScrollChange(event: any) {
    this.scroll$.next(event);
  }

  scrollable(scrollable: boolean) {
    this.scrollable$.next(scrollable);
  }

  stopScrollListener(stop: boolean) {
    this.scrollListening$.next({ stop: stop });
  }
}
