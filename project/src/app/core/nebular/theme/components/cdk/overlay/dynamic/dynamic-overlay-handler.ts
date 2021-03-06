import { ElementRef, Injectable, SimpleChange, Type } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NbTrigger, NbTriggerStrategy, NbTriggerStrategyBuilderService } from '../overlay-trigger';
import {
  NbAdjustableConnectedPositionStrategy,
  NbAdjustment,
  NbPosition,
  NbPositionBuilderService,
} from '../overlay-position';
import { NbRenderableContainer } from '../overlay-container';
import { NbOverlayContent } from '../overlay';
import { NbDynamicOverlay } from './dynamic-overlay';

export class NbDynamicOverlayChange extends SimpleChange {

  constructor(previousValue: any, currentValue: any, firstChange: boolean = false) {
    super(previousValue, currentValue, firstChange);
  }

  isChanged(): boolean {
    return this.currentValue !== this.previousValue;
  }
}

@Injectable()
export class NbDynamicOverlayHandler {

  protected _componentType: Type<NbRenderableContainer>;
  protected _host: ElementRef;
  protected _context: any = {};
  protected _content: NbOverlayContent;
  protected _trigger: NbTrigger = NbTrigger.NOOP;
  protected _position: NbPosition = NbPosition.TOP;
  protected _adjustment: NbAdjustment = NbAdjustment.NOOP;
  protected _offset: number = 15;

  protected dynamicOverlay: NbDynamicOverlay;

  protected positionStrategy: NbAdjustableConnectedPositionStrategy;
  protected disconnect$ = new Subject();

  protected changes: { [key: string]: NbDynamicOverlayChange } = {};

  constructor(private positionBuilder: NbPositionBuilderService,
              private triggerStrategyBuilder: NbTriggerStrategyBuilderService,
              private dynamicOverlayService: NbDynamicOverlay) {
  }

  host(host: ElementRef): this {
    this.changes.host = new NbDynamicOverlayChange(this._host, host);
    this._host = host;
    return this;
  }

  trigger(trigger: NbTrigger): this {
    this.changes.trigger = new NbDynamicOverlayChange(this._trigger, trigger);
    this._trigger = trigger;
    return this;
  }

  position(position: NbPosition): this {
    this.changes.position = new NbDynamicOverlayChange(this._position, position);
    this._position = position;
    return this;
  }

  adjustment(adjustment: NbAdjustment): this {
    this.changes.adjustment = new NbDynamicOverlayChange(this._adjustment, adjustment);
    this._adjustment = adjustment;
    return this;
  }

  componentType(componentType: Type<NbRenderableContainer>): this {
    this.changes.componentType = new NbDynamicOverlayChange(this._componentType, componentType);
    this._componentType = componentType;
    return this;
  }

  content(content: NbOverlayContent): this {
    this.changes.content = new NbDynamicOverlayChange(this._content, content);
    this._content = content;
    return this;
  }

  context(context: any): this {
    this.changes.context = new NbDynamicOverlayChange(this._context, context);
    this._context = context;
    return this;
  }

  offset(offset: number): this {
    this.changes.offset = new NbDynamicOverlayChange(this._offset, offset);
    this._offset = offset;
    return this;
  }

  build(): NbDynamicOverlay {
    if (!this._componentType || !this._host) {
      throw Error(`NbDynamicOverlayHandler: at least 'componentType' and 'host' should be
      passed before building a dynamic overlay.`);
    }
    this.dynamicOverlay = this.dynamicOverlayService.create(
      this._componentType,
      this._content,
      this._context,
      this.createPositionStrategy(),
    );

    this.connect();
    this.clearChanges();

    return this.dynamicOverlay;
  }

  rebuild(): NbDynamicOverlay {
    /**
     * we should not throw here
     * as we use rebuilt in lifecycle hooks
     * which it could be called before the build
     * so we just ignore this call
     */
    if (!this.dynamicOverlay) {
      return;
    }

    if (this.isPositionStrategyUpdateRequired()) {
      this.dynamicOverlay.setPositionStrategy(this.createPositionStrategy());
    }

    if (this.isTriggerStrategyUpdateRequired()) {
      this.connect();
    }

    if (this.isContainerRerenderRequired()) {
      this.dynamicOverlay.setContentAndContext(this._content, this._context);
    }

    if (this.isComponentTypeUpdateRequired()) {
      this.dynamicOverlay.setComponent(this._componentType);
    }

    this.clearChanges();
    return this.dynamicOverlay;
  }

  connect(): void {
    if (!this.dynamicOverlay) {
      throw new Error(`NbDynamicOverlayHandler: cannot connect to DynamicOverlay
      as it is not created yet. Call build() first`);
    }
    this.disconnect();
    this.subscribeOnTriggers(this.dynamicOverlay);
  }

  disconnect(): void {
    this.disconnect$.next();
  }

  destroy(): void {
    this.disconnect();
    this.clearChanges();
    if (this.dynamicOverlay) {
      this.dynamicOverlay.dispose();
    }
  }

  protected createPositionStrategy(): any {
    return this.positionBuilder
      .connectedTo(this._host)
      .position(this._position)
      .adjustment(this._adjustment)
      .offset(this._offset);
  }

  protected subscribeOnTriggers(dynamicOverlay: NbDynamicOverlay): void {

    const triggerStrategy: NbTriggerStrategy = this.triggerStrategyBuilder
      .trigger(this._trigger)
      .host(this._host.nativeElement)
      .container(() => dynamicOverlay.getContainer())
      .build();

    triggerStrategy.show$.pipe(
      takeUntil(this.disconnect$),
    ).subscribe(() => dynamicOverlay.show());

    triggerStrategy.hide$.pipe(
      takeUntil(this.disconnect$),
    ).subscribe(() => dynamicOverlay.hide());
  }

  protected isContainerRerenderRequired(): boolean {
    return this.isContentUpdated()
      || this.isContextUpdated()
      || this.isPositionStrategyUpdateRequired();
  }

  protected isPositionStrategyUpdateRequired(): boolean {
    return this.isAdjustmentUpdated() || this.isPositionUpdated() || this.isOffsetUpdated() || this.isHostUpdated();
  }

  protected isTriggerStrategyUpdateRequired(): boolean {
    return this.isTriggerUpdated() || this.isHostUpdated();
  }

  protected isComponentTypeUpdateRequired(): boolean {
    return this.isComponentTypeUpdated();
  }

  protected isComponentTypeUpdated(): boolean {
    return this.changes.componentType && this.changes.componentType.isChanged();
  }

  protected isContentUpdated(): boolean {
    return this.changes.content && this.changes.content.isChanged();
  }

  protected isContextUpdated(): boolean {
    return this.changes.context && this.changes.context.isChanged();
  }

  protected isAdjustmentUpdated(): boolean {
    return this.changes.adjustment && this.changes.adjustment.isChanged();
  }

  protected isPositionUpdated(): boolean {
    return this.changes.position && this.changes.position.isChanged();
  }

  protected isHostUpdated(): boolean {
    return this.changes.host && this.changes.host.isChanged();
  }

  protected isTriggerUpdated(): boolean {
    return this.changes.trigger && this.changes.trigger.isChanged();
  }

  protected isOffsetUpdated(): boolean {
    return this.changes.offset && this.changes.offset.isChanged();
  }

  protected clearChanges(): void {
    this.changes = {};
  }
}
