export interface DynamicValidatorDescriptor {
  name: string;
  args: any;
}

export interface DynamicValidatorsConfig {
  [validatorKey: string]: any | DynamicValidatorDescriptor;
}

export enum DynamicFormHook {
  Blur = 'blur',
  Change = 'change',
  Submit = 'submit',
}
