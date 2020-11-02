import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  Renderer2,
  ViewChild,
  Type,
  ComponentFactoryResolver,
  Input,
  AfterViewChecked,
} from '@angular/core';
import {
  NbComponentPortal,
  NbFocusTrap,
  NbFocusTrapFactoryService,
  NbOverlayContainerComponent,
  NbTemplatePortal,
} from '../cdk';
import { NbComponentType } from '../cdk/overlay';
import { NB_WINDOW_CONTENT, NbWindowConfig, NbWindowState, NB_WINDOW_CONTEXT } from './window.options';
import { NbWindowRef } from './window-ref';

@Component({
  selector: 'nb-window',
  template: `
    <nb-card>
      <nb-card-header>
        <div cdkFocusInitial class="title" tabindex="-1">{{ config.title }}</div>

        <div class="buttons">
          <button class="button" (click)="minimize()">
            <i class="nb-fold"></i>
          </button>
          <button class="button" *ngIf="isFullScreen" (click)="maximize()">
            <i class="nb-minimize"></i>
          </button>
          <button class="button" *ngIf="minimized || maximized" (click)="maximizeOrFullScreen()">
            <i class="nb-maximize"></i>
          </button>
          <button class="button" (click)="close()">
            <i class="nb-close"></i>
          </button>
        </div>
      </nb-card-header>
      <nb-card-body *ngIf="maximized || isFullScreen">
        <nb-overlay-container></nb-overlay-container>
      </nb-card-body>
    </nb-card>
  `,
  styleUrls: ['./window.component.scss'],
})
export class NbWindowComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() cfr: ComponentFactoryResolver;

  @HostBinding('class.full-screen')
  get isFullScreen(): boolean {
    return this.windowRef.state === NbWindowState.FULL_SCREEN;
  }

  @HostBinding('class.maximized')
  get maximized(): boolean {
    return this.windowRef.state === NbWindowState.MAXIMIZED;
  }

  @HostBinding('class.minimized')
  get minimized(): boolean {
    return this.windowRef.state === NbWindowState.MINIMIZED;
  }

  @ViewChild(NbOverlayContainerComponent, { static: true }) overlayContainer: NbOverlayContainerComponent;

  protected focusTrap: NbFocusTrap;

  constructor(
    @Inject(NB_WINDOW_CONTENT) public content: TemplateRef<any> | NbComponentType,
    @Inject(NB_WINDOW_CONTEXT) public context: any,
    public windowRef: NbWindowRef,
    public config: NbWindowConfig,
    protected focusTrapFactory: NbFocusTrapFactoryService,
    protected elementRef: ElementRef,
    protected renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
    this.focusTrap.blurPreviouslyFocusedElement();
    this.focusTrap.focusInitialElement();

    if (this.config.windowClass) {
      this.renderer.addClass(this.elementRef.nativeElement, this.config.windowClass);
    }
  }

  ngAfterViewChecked(): void {
    if (!this.overlayContainer || this.overlayContainer.isAttached) {
      return;
    }

    if (this.content instanceof TemplateRef) {
      this.attachTemplate();
    } else {
      this.attachComponent();
    }
  }

  ngOnDestroy(): void {
    if (this.focusTrap) {
      this.focusTrap.restoreFocus();
    }

    this.close();
  }

  minimize(): void {
    if (this.windowRef.state === NbWindowState.MINIMIZED) {
      this.windowRef.toPreviousState();
    } else {
      this.windowRef.minimize();
    }
  }

  maximize(): void {
    this.windowRef.maximize();
  }

  fullScreen(): void {
    this.windowRef.fullScreen();
  }

  maximizeOrFullScreen(): void {
    if (this.windowRef.state === NbWindowState.MINIMIZED) {
      this.maximize();
    } else {
      this.fullScreen();
    }
  }

  close(): void {
    this.windowRef.close();
  }

  protected attachTemplate(): void {
    this.overlayContainer
      .attachTemplatePortal(new NbTemplatePortal(this.content as TemplateRef<any>, null, this.context));
  }

  protected attachComponent(): void {
    const portal = new NbComponentPortal(this.content as Type<any>, null, null, this.cfr);
    const ref = this.overlayContainer.attachComponentPortal(portal);
    Object.assign(ref.instance, this.context);
    ref.changeDetectorRef.detectChanges();
  }
}
