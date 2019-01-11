import { Directive, ElementRef, Renderer2, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[moreDetail]',
})
export class MoreDetailDirective implements OnInit, OnDestroy {

  private alive: boolean = true;

  private uuid: string;

  private klass: string = 'nav-title-link';

  @Input()
  set moreDetail(uid: string) {
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
      this.router.navigate(['/p/document'], { queryParams });
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, this.klass);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
