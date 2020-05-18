import { Directive, ElementRef, Input, OnInit, ComponentFactoryResolver, ComponentFactory, ComponentRef, Renderer2, ViewContainerRef, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subscription } from 'rxjs';
import { SelectableItemComponent } from './selectable-item.component';

@Directive({ selector: '[selectable]' })
export class SelectableItemDirective implements OnInit, OnDestroy {

  document: DocumentModel;

  componentRef: ComponentRef<SelectableItemComponent>;

  componentFactory: ComponentFactory<SelectableItemComponent>;

  @Input() disabled: boolean = false;

  @Input() selected: boolean = false;

  @Input() selector: string;

  @Input() dataType: string = 'default';

  @Input() enableCheckBox: boolean = true;

  @Input()
  set selectable(doc: DocumentModel) {
    this.document = doc;
  }

  @HostBinding('class.item-selected')
  get isSelected(): boolean {
    return this.selected;
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = event.target as HTMLElement;
    if (!this.selector || (this.selector && target.closest(this.selector))) {
      this.toggleCheckboxStatus();
    }
  }

  private subscription: Subscription = new Subscription();

  constructor(
    private directiveView: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private directiveElement: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.createComponent();
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
    instance.selected = this.selected;
    instance.dataType = this.dataType;
    instance.enableCheckBox = this.enableCheckBox;
    typeof this.document !== 'undefined' && (instance.document = this.document);
    this.subscription = instance.onSelected.subscribe((selected: boolean) => this.selected = selected);
  }

  private toggleCheckboxStatus(): void {
    if (this.componentRef) {
      this.componentRef.instance.toggleChecked();
    }
  }

}
