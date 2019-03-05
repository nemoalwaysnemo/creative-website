export interface DynamicValidatorDescriptor {

  name: string;
  args: any;
}

export class DynamicValidatorsConfig {
  [validatorKey: string]: any | DynamicValidatorDescriptor
}
