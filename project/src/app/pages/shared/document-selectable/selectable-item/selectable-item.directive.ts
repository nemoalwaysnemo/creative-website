import { Directive, ElementRef, Input, OnInit, ComponentFactoryResolver, ComponentFactory, ComponentRef, Renderer2, ViewContainerRef, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
import { SelectableItemComponent } from './selectable-item.component';
import { SelectableItemSettings } from './selectable-item.interface';

@Directive({
  selector: '[selectable]',
})
export class SelectableItemDirective implements OnInit, OnDestroy {

  checkboxStyle: string;

  @Input()
  set selectable(doc: DocumentModel) {
    this.document = doc;
  }

  @Input()
  set settings(settings: SelectableItemSettings) {
    if (settings) {
      this.selectableSettings = settings;
    }
  }

  @Input()
  set selectableCheckboxStyle(style: string){
    this.checkboxStyle = style;
    this.setCheckboxStyle(style);
  }

  @HostBinding('class.item-selected')
  get isSelected(): boolean {
    return this.selectableSettings.enableSelectable && this.selected;
  }

  constructor(
    private directiveView: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private directiveElement: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  document: DocumentModel;

  componentRef: ComponentRef<SelectableItemComponent>;

  componentFactory: ComponentFactory<SelectableItemComponent>;

  @Input() disabled: boolean = false;

  @Input() selected: boolean = false;

  private selectableSettings: SelectableItemSettings = new SelectableItemSettings();

  private subscription: Subscription = new Subscription();

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = event.target as HTMLElement;
    if (this.selectableSettings.enableSelectable && !this.selectableSettings.allowShiftMultiSelect && (!this.selectableSettings.selector || (this.selectableSettings.selector && target.closest(this.selectableSettings.selector)))) {
      this.toggleCheckboxStatus();
    }
  }

  ngOnInit(): void {
    if (this.selectableSettings.enableSelectable) {
      this.createComponent();
      this.setCheckboxStyle(this.checkboxStyle);
    }
  }

  ngOnDestroy(): void {
    this.destroyComponent();
  }

  private createComponent(): void {
    if (!this.componentRef) {
      this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(SelectableItemComponent);
      this.componentRef = this.directiveView.createComponent<SelectableItemComponent>(this.componentFactory);
      this.setInstanceInputs(this.componentRef.instance);
      this.componentRef.changeDetectorRef.detectChanges();
      this.renderer.appendChild(this.directiveElement.nativeElement, this.componentRef.location.nativeElement);
    }
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.subscription.unsubscribe();
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private setInstanceInputs(instance: SelectableItemComponent): void {
    instance.disabled = this.disabled;
    instance.active = this.selected;
    instance.dataType = this.selectableSettings.dataType;
    instance.queueLimit = this.selectableSettings.queueLimit;
    typeof this.document !== 'undefined' && (instance.document = this.document);
    this.subscription = instance.select.subscribe((selected: boolean) => this.selected = selected);
  }

  private toggleCheckboxStatus(): void {
    if (this.componentRef) {
      this.componentRef.instance.toggleChecked();
    }
  }

  private setCheckboxStyle(style: any): void {
    if (this.componentRef) {
      this.componentRef.instance.checkboxSelectStyle(style);
    }
  }
}
