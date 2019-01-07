import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { GalleryState } from '../models/gallery.model';
import { GalleryConfig } from '../models/config.model';

@Component({
  selector: 'gallery-play',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="float: right">
        <button
         (ngxTapClick)="playButton.emit(1)">
          play
        </button>
        <button
         (ngxTapClick)="playButton.emit(2)">
          stop
        </button>
    </div>
  `,
})
export class GalleryPlayComponent {
  @Input() state: GalleryState;
  @Input() config: GalleryConfig;
  @Output() action = new EventEmitter<number>();
  @Output() playButton = new EventEmitter<number>();
}
