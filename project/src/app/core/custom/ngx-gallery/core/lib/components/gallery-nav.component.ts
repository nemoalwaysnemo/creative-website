import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GalleryState } from '../models/gallery.model';
import { GalleryConfig } from '../models/config.model';

@Component({
  selector: 'gallery-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <i *ngIf="config.loop || state.hasPrev"
       class="g-nav-prev"
       aria-label="Previous"
       (tapClick)="action.emit('prev')"
       [innerHtml]="navIcon"></i>

    <i *ngIf="config.loop || state.hasNext"
       class="g-nav-next"
       aria-label="Next"
       (tapClick)="action.emit('next')"
       [innerHtml]="navIcon"></i>
  `,
})
export class GalleryNavComponent implements OnInit {

  navIcon: SafeHtml;
  @Input() state: GalleryState;
  @Input() config: GalleryConfig;
  @Output() action: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.navIcon = this._sanitizer.bypassSecurityTrustHtml(this.config.navIcon);
  }
}
