import { Directive, ElementRef, Renderer2, HostBinding, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel } from '@core/api';

@Directive({
  selector: '[tbwaMoreDetail]',
})
export class MoreDetailDirective implements OnInit, OnDestroy {

  private alive: boolean = true;

  private uuid: string;

  private klass: string = 'nav-title-link';

  @Input()
  set tbwaMoreDetail(uid: string) {
    this.uuid = uid;
  }

  @Input()
  set moreDetailCss(klass: string) {
    this.klass = klass;
  }

  constructor(private router: Router, private elementRef: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('click')
  onClick() {
    if (this.alive) {
      const queryParams = { id: this.uuid };
      this.router.navigate(['/p/document'], { queryParamsHandling: 'merge', queryParams });
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, this.klass);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
