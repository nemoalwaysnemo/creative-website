/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { cloneDeep } from 'lodash';

/**
 * Extending object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */

export const deepExtend = (...objects: any[]) => {
  if (objects.length < 1 || typeof objects[0] !== 'object') {
    return false;
  }

  if (objects.length < 2) {
    return objects[0];
  }

  const target = objects[0];

  // convert arguments to array and cut off target object
  const args = Array.prototype.slice.call(objects, 1);

  let val;
  let src;

  args.forEach((obj: any) => {
    // skip argument if it is array or isn't object
    if (typeof obj !== 'object' || Array.isArray(obj)) {
      return;
    }

    Object.keys(obj).forEach((key) => {
      src = target[key]; // source value
      val = obj[key]; // new value

      // recursion prevention
      if (val === target) {
        return;

        /**
         * if new value isn't object then just overwrite by new value
         * instead of extending.
         */
      } else if (typeof val !== 'object' || val === null) {
        target[key] = val;
        return;

        // just clone arrays (and recursive clone objects inside)
      } else if (Array.isArray(val)) {
        target[key] = cloneDeep(val);
        return;

        // overwrite by new value if source isn't object or array
      } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
        target[key] = deepExtend({}, val);
        return;

        // source value and new value is objects both, extending...
      } else {
        target[key] = deepExtend(src, val);
        return;
      }
    });
  });

  return target;
};

export class Deferred {

  promise: Promise<any>;

  resolve: any;
  reject: any;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

// getDeepFromObject({result: {data: 1}}, 'result.data', 2); // returns 1
export function getDeepFromObject(object: any = {}, name: string, defaultValue?: any): any {
  const keys = name.split('.');
  // clone the object
  let level = deepExtend({}, object);
  keys.forEach((k) => {
    if (level && typeof level[k] !== 'undefined') {
      level = level[k];
    }
  });

  return typeof level === 'undefined' ? defaultValue : level;
}

export function range(start: number, end: number, step: number = 0, offset: number = 0): any[] {
  const len = (Math.abs(end - start) + ((offset || 0) * 2)) / (step || 1) + 1;
  const direction = start < end ? 1 : -1;
  const startingPoint = start - (direction * (offset || 0));
  const stepSize = direction * (step || 1);
  return Array(len).fill(0).map((_, index) => {
    return startingPoint + (stepSize * index);
  });
}
