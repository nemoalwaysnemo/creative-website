import { ComponentFactoryResolver, ComponentRef, Injectable, NgZone, Type } from '@angular/core';
import { filter, takeUntil, takeWhile } from 'rxjs/operators';
import { Subject } from 'rxjs';

import {
  NbAdjustableConnectedPositionStrategy,
  NbPosition,
} from '../overlay-position';

import { NbRenderableContainer } from '../overlay-container';
import { createContainer, NbOverlayContent, NbOverlayService, patch } from '../overlay';
import { NbOverlayRef } from '../mapping';

export interface NbDynamicOverlayController {
  show(): void;
  hide(): void;
  toggle(): void;
  rebuild(): void;
}

@Injectable()
export class NbDynamicOverlay {

  event$: Subject<string> = new Subject();
  protected ref: NbOverlayRef;
  protected container: ComponentRef<NbRenderableContainer>;
  protected componentType: Type<NbRenderableContainer>;
  protected context: any = {};
  protected content: NbOverlayContent;
  protected positionStrategy: NbAdjustableConnectedPositionStrategy;

  protected positionStrategyChange$ = new Subject();
  protected alive = true;

  get isAttached(): boolean {
    return this.ref && this.ref.hasAttached();
  }

  constructor(
    private overlay: NbOverlayService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private zone: NgZone) {
  }

  create(componentType: Type<NbRenderableContainer>, content: NbOverlayContent, context: any, positionStrategy: NbAdjustableConnectedPositionStrategy): this {

    this.setContentAndContext(content, context);
    this.setComponent(componentType);
    this.setPositionStrategy(positionStrategy);

    return this;
  }

  setContent(content: NbOverlayContent): void {
    this.content = content;

    if (this.container) {
      this.updateContext();
    }
  }

  setContext(context: any): void {
    this.context = context;

    if (this.container) {
      this.updateContext();
    }
  }

  setContentAndContext(content: NbOverlayContent, context: any): void {
    this.content = content;
    this.context = context;
    if (this.container) {
      this.updateContext();
    }
  }

  setComponent(componentType: Type<NbRenderableContainer>): void {
    this.componentType = componentType;

    // in case the component is shown we recreate it and show it back
    if (this.ref && this.isAttached) {
      this.dispose();
      this.show();
    } else if (this.ref && !this.isAttached) {
      this.dispose();
    }
  }

  setPositionStrategy(positionStrategy: NbAdjustableConnectedPositionStrategy): void {
    this.positionStrategyChange$.next();

    this.positionStrategy = positionStrategy;

    this.positionStrategy.positionChange
      .pipe(
        takeWhile(() => this.alive),
        takeUntil(this.positionStrategyChange$),
        filter(() => !!this.container),
      )
      .subscribe((position: NbPosition) => patch(this.container, { position }));

    if (this.ref) {
      this.ref.updatePositionStrategy(this.positionStrategy);
    }
  }

  show(): void {
    if (!this.ref) {
      this.createOverlay();
    }
    this.renderContainer();
    this.event$.next('show');
  }

  hide(): void {
    if (!this.ref) {
      return;
    }
    this.ref.detach();
    this.container = null;
    this.event$.next('hide');
  }

  toggle(): void {
    if (this.isAttached) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose(): void {
    this.alive = false;
    this.hide();
    if (this.ref) {
      this.ref.dispose();
      this.ref = null;
    }
  }

  getContainer(): any {
    return this.container;
  }

  protected createOverlay(): void {
    this.ref = this.overlay.create({
      positionStrategy: this.positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.updatePositionWhenStable();
  }

  protected renderContainer(): void {
    const containerContext = this.createContainerContext();
    if (!this.container) {
      this.container = createContainer(this.ref, this.componentType, containerContext, this.componentFactoryResolver);
    }
    this.container.instance.renderContent();
  }

  protected updateContext(): void {
    const containerContext = this.createContainerContext();
    Object.assign(this.container.instance, containerContext);
    this.container.instance.renderContent();
    this.container.changeDetectorRef.detectChanges();
  }

  protected createContainerContext(): any {
    return {
      content: this.content,
      context: this.context,
      cfr: this.componentFactoryResolver,
    };
  }

  /**
   * Dimensions of the container may change after content update. So we listen to zone.stable event to
   * reposition the container.
   */
  protected updatePositionWhenStable(): void {
    this.zone.onStable
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.ref && this.ref.updatePosition());
  }
}
