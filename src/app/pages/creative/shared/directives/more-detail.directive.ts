import { Directive, ElementRef, Renderer2, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[moreDetail]',
})
export class MoreDetailDirective implements OnInit {

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
    const queryParams = { id: this.uuid };
    this.router.navigate(['/p/document'], { queryParams });
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, this.klass);
  }
}
