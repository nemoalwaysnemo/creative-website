/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isFunction(value: any): value is (model) => any {
  return typeof value === 'function';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}
