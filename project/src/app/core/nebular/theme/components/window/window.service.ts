import {
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Injectable,
  Injector,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import {
  NbComponentPortal,
  NbComponentType,
  NbOverlayPositionBuilder,
  NbOverlayRef,
  NbOverlayService,
} from '../cdk/overlay';
import { NbBlockScrollStrategyAdapter } from '../cdk/adapter/block-scroll-strategy-adapter';
import {
  NB_WINDOW_CONFIG,
  NB_WINDOW_CONTENT,
  NB_WINDOW_CONTEXT,
  NbWindowConfig,
  NbWindowState,
} from './window.options';
import { NbWindowRef } from './window-ref';
import { NbWindowsContainerComponent } from './windows-container.component';
import { NbWindowComponent } from './window.component';

/**
 * The `NbWindowService` can be used to open windows.
 *
 * @stacked-example(Showcase, window/window-showcase.component)
 *
 * ### Installation
 *
 * Import `NbWindowModule` to your app module.
 * ```ts
 * @NgModule({
 *   imports: [
 *   	// ...
 *     NbWindowModule.forRoot(config),
 *   ],
 * })
 * export class AppModule { }
 * ```
 *
 * If you are using it in a lazy loaded module than you have to install `NbWindowModule.forChild`:
 * ```ts
 * @NgModule({
 *   imports: [
 *   	// ...
 *     NbWindowModule.forChild(config),
 *   ],
 * })
 * export class LazyLoadedModule { }
 * ```
 *
 * ### Usage
 *
 * A new window can be opened by calling the `open` method with a component or template to be loaded
 * and an optional configuration.
 * `open` method will return `NbWindowRef` that can be used for the further manipulations.
 *
 * ```ts
 * const windowRef = this.windowService.open(MyComponent, { ... });
 * ```
 *
 * `NbWindowRef` gives you ability manipulate opened window.
 * Also, you can inject `NbWindowRef` inside provided component which rendered in window.
 *
 * ```ts
 * this.windowService.open(MyWindowComponent, { ... });
 *
 * // my.component.ts
 * constructor(protected windowRef: NbWindowRef) {
 * }
 *
 * minimize() {
 *   this.windowRef.minimize();
 * }
 *
 * close() {
 *   this.windowRef.close();
 * }
 * ```
 *
 * Instead of component you can create window from TemplateRef. As usual you can access context provided via config
 * via `let-` variables. Also you can get reference to the `NbWindowRef` in context's `windowRef` property.
 *
 * @stacked-example(Window content from TemplateRef, window/template-window.component)
 *
 * ### Configuration
 *
 * As mentioned above, `open` method of the `NbWindowService` may receive optional configuration options.
 * Also, you can modify default windows configuration through `NbWindowModule.forRoot({ ... })`.
 * You can read about all available options on [API tab](docs/components/window/api#nbwindowconfig).
 *
 * @stacked-example(Configuration, window/windows-backdrop.component)
 */
@Injectable()
export class NbWindowService {

  protected overlayRef: NbOverlayRef;
  protected windowsContainerViewRef: ViewContainerRef;
  protected openWindows: NbWindowRef[] = [];

  constructor(
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected overlayService: NbOverlayService,
    protected overlayPositionBuilder: NbOverlayPositionBuilder,
    protected blockScrollStrategy: NbBlockScrollStrategyAdapter,
    @Inject(NB_WINDOW_CONFIG) protected readonly defaultWindowsConfig: NbWindowConfig,
    protected cfr: ComponentFactoryResolver,
  ) {
  }

  /**
   * Opens new window.
   * @param windowContent
   * @param windowConfig
   */
  open(
    windowContent: TemplateRef<any> | NbComponentType,
    windowConfig: Partial<NbWindowConfig> = {},
  ): NbWindowRef {
    if (this.windowsContainerViewRef === null) {
      this.createWindowsContainer();
    }

    const config = new NbWindowConfig(this.defaultWindowsConfig, windowConfig);
    const windowRef = new NbWindowRef(config);
    windowRef.componentRef = this.appendWindow(windowContent, config, windowRef);

    this.openWindows.push(windowRef);
    this.subscribeToEvents(windowRef);

    return windowRef;
  }

  protected createWindowsContainer(): void {
    this.overlayRef = this.overlayService.create({
      scrollStrategy: this.overlayService.scrollStrategies.noop(),
      positionStrategy: this.overlayPositionBuilder.global().bottom().right(),
      hasBackdrop: true,
    });
    const windowsContainerPortal = new NbComponentPortal(NbWindowsContainerComponent, null, null, this.cfr);
    const overlayRef = this.overlayRef.attach(windowsContainerPortal);
    this.windowsContainerViewRef = overlayRef.instance.viewContainerRef;
  }

  protected appendWindow(
    content: TemplateRef<any> | NbComponentType,
    config: NbWindowConfig,
    windowRef: NbWindowRef,
  ): ComponentRef<NbWindowComponent> {
    const context = content instanceof TemplateRef
      ? { $implicit: config.context, windowRef }
      : config.context;

    const providers = [
      { provide: NB_WINDOW_CONTENT, useValue: content },
      { provide: NB_WINDOW_CONTEXT, useValue: context },
      { provide: NbWindowConfig, useValue: config },
      { provide: NbWindowRef, useValue: windowRef },
    ];
    const parentInjector = config.viewContainerRef
      ? config.viewContainerRef.injector
      : this.windowsContainerViewRef.injector;
    const injector = Injector.create({ parent: parentInjector, providers });
    const windowFactory = this.componentFactoryResolver.resolveComponentFactory(NbWindowComponent);

    const ref = this.windowsContainerViewRef.createComponent(windowFactory, null, injector);
    ref.instance.cfr = this.cfr;
    ref.changeDetectorRef.detectChanges();
    return ref;
  }

  protected subscribeToEvents(windowRef: NbWindowRef): void {
    if (windowRef.config.closeOnBackdropClick) {
      this.overlayRef.backdropClick().subscribe(() => windowRef.close());
    }

    if (windowRef.config.closeOnEsc) {
      this.overlayRef.keydownEvents()
        .pipe(filter((event: KeyboardEvent) => event.key === 'Escape'))
        .subscribe(() => windowRef.close());
    }

    windowRef.stateChange.subscribe(() => this.checkAndUpdateOverlay());

    windowRef.onClose.subscribe(() => {
      this.openWindows.splice(this.openWindows.indexOf(windowRef), 1);
      this.checkAndUpdateOverlay();
    });
  }

  protected checkAndUpdateOverlay(): void {
    const fullScreenWindows = this.openWindows.filter(w => w.state === NbWindowState.FULL_SCREEN);
    if (fullScreenWindows.length > 0) {
      this.blockScrollStrategy.enable();
    } else {
      this.blockScrollStrategy.disable();
    }

    if (fullScreenWindows.some(w => w.config.hasBackdrop)) {
      this.overlayRef.backdropElement.removeAttribute('hidden');
    } else {
      this.overlayRef.backdropElement.setAttribute('hidden', '');
    }
  }
}
