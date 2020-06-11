import { Component, Input, ChangeDetectionStrategy, HostBinding, Output, EventEmitter } from '@angular/core';
import { GalleryConfig } from '../models/config.model';
import { LoadingStrategy, GalleryItemType } from '../models/constants';

@Component({
  selector: 'gallery-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="load" [ngSwitch]="type">

      <ng-container *ngSwitchCase="Types.Image">

        <gallery-image [src]="data.src"
                       [loadingIcon]="config.loadingIcon"
                       [loadingError]="config.loadingError"
                       (error)="error.emit($event)">
        </gallery-image>

        <div class="g-template g-item-template">
          <ng-container *ngTemplateOutlet="config.itemTemplate; context: { index: index, currIndex: currIndex, type: type, data: data }"></ng-container>
        </div>

      </ng-container>

      <ng-container *ngSwitchCase="Types.Video">

        <gallery-video [src]="data.src"
                       [title]="data.title"
                       [poster]="data.poster"
                       [settings]="settings"
                       [pause]="!isActive"
                       (error)="error.emit($event)"
                       (customEvent)="onCustomEvent($event)">
        </gallery-video>

        <div class="g-template g-item-template">
          <ng-container *ngTemplateOutlet="config.itemTemplate; context: { index: index, currIndex: currIndex, type: type, data: data }"></ng-container>
        </div>

      </ng-container>

      <gallery-iframe *ngSwitchCase="Types.Youtube"
                      [src]="data.src"
                      [pause]="!isActive">
      </gallery-iframe>

      <gallery-iframe *ngSwitchCase="Types.Iframe"
                      [src]="data.src">
      </gallery-iframe>

      <ng-container *ngSwitchDefault>

        <div class="g-template g-item-template">
          <ng-container *ngTemplateOutlet="config.itemTemplate; context: { index: index, currIndex: currIndex, type: type, data: data }">
          </ng-container>
        </div>

      </ng-container>

    </ng-container>
  `,
})
export class GalleryItemComponent {

  readonly Types = GalleryItemType;

  /** Gallery config */
  @Input() config: GalleryConfig;

  /** Item's index in the gallery */
  @Input() index: number;

  /** Gallery current index */
  @Input() currIndex: number;

  /** Item's type 'image', 'video', 'youtube', 'iframe' */
  @Input() type: string;

  /** Item's data, this object contains the data required to display the content (e.g. src path) */
  @Input() data: any = {};

  @Input() settings: any = {};

  /** Stream that emits when an error occurs */
  @Output() error: EventEmitter<Error> = new EventEmitter<Error>();

  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class.g-active-item')
  get isActive(): boolean {
    return this.index === this.currIndex;
  }

  get load(): boolean {
    switch (this.config.loadingStrategy) {
      case LoadingStrategy.Preload:
        return true;
      case LoadingStrategy.Lazy:
        return this.currIndex === this.index;
      default:
        return this.currIndex === this.index || this.currIndex === this.index - 1 || this.currIndex === this.index + 1;
    }
  }

  onCustomEvent(event: any): void {
    event['uid'] = this.data.uid;
    event['title'] = this.data.title;
    this.customEvent.emit(event);
  }

}
