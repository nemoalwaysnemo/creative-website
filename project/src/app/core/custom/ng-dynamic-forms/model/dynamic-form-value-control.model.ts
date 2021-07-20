import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicFormControlModel, DynamicFormControlModelConfig } from './dynamic-form-control.model';
import { DynamicFormControlLayout } from './misc/dynamic-form-control-layout.model';
import { serializable } from '../decorator/serializable.decorator';
import { isBoolean, isObject } from '../utils/core.utils';

export interface DynamicFormValueControlModelConfig<T> extends DynamicFormControlModelConfig {
  additional?: { [key: string]: any };
  hint?: string;
  tabIndex?: number;
}

export abstract class DynamicFormValueControlModel<T> extends DynamicFormControlModel {

  @serializable() additional: { [key: string]: any } | null;
  @serializable() hint: string | null;
  @serializable() tabIndex: number | null;

  protected constructor(config: DynamicFormValueControlModelConfig<T>, layout?: DynamicFormControlLayout) {

    super(config, layout);
    this.additional = isObject(config.additional) ? config.additional : null;
    this.hint = config.hint || null;
    this.tabIndex = config.tabIndex || null;
  }

  getAdditional(key: string, defaultValue?: any | null): any {
    return this.additional !== null && this.additional.hasOwnProperty(key) ? this.additional[key] : defaultValue;
  }
}
