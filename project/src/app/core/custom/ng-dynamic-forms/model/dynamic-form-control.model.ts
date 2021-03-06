import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicFormControlLayout } from './misc/dynamic-form-control-layout.model';
import { DynamicPathable } from './misc/dynamic-form-control-path.model';
import { DynamicFormControlRelation } from './misc/dynamic-form-control-relation.model';
import { DynamicFormHook, DynamicValidatorsConfig } from './misc/dynamic-form-control-validation.model';
import { serializable, serialize } from '../decorator/serializable.decorator';
import { isBoolean, isObject, isString } from '../utils/core.utils';
import { DocumentFormContext } from '@pages/shared/document-form/document-form.interface';

export interface DynamicFormControlModelConfig {
  asyncValidators?: DynamicValidatorsConfig;
  disabled?: boolean;
  errorMessages?: DynamicValidatorsConfig;
  hidden?: boolean;
  readOnly?: boolean;
  hiddenFn?: (ctx: DocumentFormContext) => boolean;
  visibleFn?: (ctx: DocumentFormContext) => boolean;
  defaultValueFn?: (ctx: DocumentFormContext) => any;
  id: string;
  value?: any;
  field?: string;
  label?: string;
  enableLabel?: boolean;
  settings?: any;
  formMode?: string;
  layoutPosition?: string;
  accordionTab?: string;
  switchTab?: string;
  labelTooltip?: string;
  controlTooltip?: string;
  required?: boolean;
  enableRequiredLabel?: boolean;
  name?: string;
  document?: any;
  defaultValue?: any;
  relations?: DynamicFormControlRelation[];
  updateOn?: DynamicFormHook;
  validators?: DynamicValidatorsConfig;
}

export abstract class DynamicFormControlModel implements DynamicPathable {

  protected constructor(config: DynamicFormControlModelConfig, layout: DynamicFormControlLayout | null = null) {

    this.asyncValidators = config.asyncValidators || null;
    this.errorMessages = config.errorMessages || null;
    this.hidden = isBoolean(config.hidden) ? config.hidden : false;
    this.readOnly = isBoolean(config.readOnly) ? config.readOnly : false;
    this.hiddenFn = config.hiddenFn || null;
    this.visibleFn = config.visibleFn || null;
    this.defaultValueFn = config.defaultValueFn || null;
    this.id = config.id;
    this.field = config.field || config.id;
    this.label = config.label || null;
    this.enableLabel = isBoolean(config.enableLabel) ? config.enableLabel : true;
    this.formMode = config.formMode || null;
    this.layoutPosition = config.layoutPosition || 'left';
    this.accordionTab = config.accordionTab || null;
    this.switchTab = config.switchTab || null;
    this.labelTooltip = config.labelTooltip || null;
    this.controlTooltip = config.controlTooltip || null;
    this.required = isBoolean(config.required) ? config.required : false;
    this.enableRequiredLabel = isBoolean(config.enableRequiredLabel) ? config.enableRequiredLabel : true;
    this.layout = layout;
    this.document = config.document;
    this.settings = config.settings || {};
    this.defaultValue = config.defaultValue || null;
    this.name = config.name || config.id;
    this.relations = Array.isArray(config.relations) ? config.relations : [];
    this.updateOn = isString(config.updateOn) ? config.updateOn : null;
    this.validators = config.validators || null;
    this.value$ = new BehaviorSubject(config.value || null);
    this.value$.subscribe(value => this._value = value);
    this.valueChanges = this.value$.asObservable();
    this.disabled$ = new BehaviorSubject(isBoolean(config.disabled) ? config.disabled : false);
    this.disabled$.subscribe(disabled => this._disabled = disabled);
    this.disabledChanges = this.disabled$.asObservable();
  }

  get value(): any {
    return this.value$.getValue();
  }

  set value(value: any) {
    this.value$.next(value);
  }

  get disabled(): boolean {
    return this.disabled$.getValue();
  }

  set disabled(disabled: boolean) {
    this.disabled$.next(disabled);
  }

  get hasErrorMessages(): boolean {
    return isObject(this.errorMessages);
  }

  private readonly disabled$: BehaviorSubject<boolean>;

  private readonly value$: BehaviorSubject<any>;

  readonly valueChanges: Observable<any>;

  readonly disabledChanges: Observable<boolean>;

  abstract readonly type: string;

  @serializable() asyncValidators: DynamicValidatorsConfig | null;
  @serializable('disabled') _disabled: boolean;
  @serializable() errorMessages: DynamicValidatorsConfig | null;
  @serializable() hidden: boolean;
  @serializable() readOnly: boolean;
  @serializable() id: string;
  @serializable() field: string;
  @serializable() label: string | null;
  @serializable() enableLabel: boolean;
  @serializable() labelTooltip: string | null;
  @serializable() formMode: string | null;
  @serializable() layoutPosition: string | 'left';
  @serializable() accordionTab: string | null;
  @serializable() switchTab: string | null;
  @serializable() controlTooltip: string | null;
  @serializable() required: boolean;
  @serializable() enableRequiredLabel: boolean;
  @serializable() layout: DynamicFormControlLayout | null;
  @serializable() name: string;
  @serializable('value') _value: any | null;
  @serializable() settings: any;
  @serializable() document: any;
  @serializable() defaultValue: any;
  parent: DynamicPathable | null = null;
  @serializable() relations: DynamicFormControlRelation[];
  @serializable() updateOn: DynamicFormHook | null;
  @serializable() validators: DynamicValidatorsConfig | null;
  @serializable() hiddenFn: (ctx: DocumentFormContext) => boolean = () => false;
  @serializable() visibleFn: (ctx: DocumentFormContext) => boolean = () => true;
  @serializable() defaultValueFn: (ctx: DocumentFormContext) => any = () => null;

  toJSON(): any {
    return serialize(this);
  }
}
