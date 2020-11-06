import { Environment, NUXEO_DOC_TYPE } from '@environment/environment';

export function join(...args: string[]): string {
  return args.join('/').replace(/(^\/+)|([^:])\/\/+/g, '$2/');
}

export function flatten(list: string[]): string[] {
  return list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

export function encodePath(path: string): string {
  let encodedPath = encodeURIComponent(path);
  // put back '/' character
  encodedPath = encodedPath.replace(/%2F/g, '/');
  // put back '@' character, needed for web adapters for instance...
  encodedPath = encodedPath.replace(/%40/g, '@');
  return encodedPath;
}
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

  let val, src;

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
        target[key] = deepCloneArray(val);

        return;

        // custom cloning and overwrite for specific objects
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(val);

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

function isSpecificValue(val: any): boolean {
  return (
    val instanceof Date
    || val instanceof RegExp
  ) ? true : false;
}

function cloneSpecificValue(val: any): any {
  if (val instanceof Date) {
    return new Date(val.getTime());
  } else if (val instanceof RegExp) {
    return new RegExp(val);
  } else {
    throw new Error('cloneSpecificValue: Unexpected situation');
  }
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr: any[]): any {
  const clone: any[] = [];
  arr.forEach((item: any, index: any) => {
    if (typeof item === 'object' && item !== null) {
      if (Array.isArray(item)) {
        clone[index] = deepCloneArray(item);
      } else if (isSpecificValue(item)) {
        clone[index] = cloneSpecificValue(item);
      } else {
        clone[index] = deepExtend({}, item);
      }
    } else {
      clone[index] = item;
    }
  });

  return clone;
}

// getDeepFromObject({result: {data: 1}}, 'result.data', 2); // returns 1
export function getDeepFromObject(object = {}, name: string, defaultValue?: any): any {
  const keys = name.split('.');
  // clone the object
  let level = deepExtend({}, object || {});
  keys.forEach((k) => {
    if (level && typeof level[k] !== 'undefined') {
      level = level[k];
    } else {
      level = undefined;
    }
  });

  return typeof level === 'undefined' ? defaultValue : level;
}

export function urlBase64Decode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: { break; }
    case 2: { output += '=='; break; }
    case 3: { output += '='; break; }
    default: {
      throw new Error('Illegal base64url string!');
    }
  }
  return b64DecodeUnicode(output);
}

export function b64decode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output: string = '';

  str = String(str).replace(/=+$/, '');

  if (str.length % 4 === 1) {
    throw new Error(`'atob' failed: The string to be decoded is not correctly encoded.`);
  }

  for (
    // initialize result and counters
    let bc: number = 0, bs: any, buffer: any, idx: number = 0;
    // get next character
    // tslint:disable-next-line:no-conditional-assignment
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    // tslint:disable-next-line:no-conditional-assignment
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}

// https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
export function b64DecodeUnicode(str: any): string {
  return decodeURIComponent(Array.prototype.map.call(b64decode(str), (c: any) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
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

export function filterParams(p: object, keepValues: string[] = []): any {
  const _ = {};
  Object.keys(p)
    .filter(key => !!p[key])
    .filter(key => p[key].length ? p[key].length > 0 : (p[key] !== null && typeof p[key] === 'object' ? Object.keys(p[key]).length > 0 : (p[key] !== null && p[key] !== undefined && p[key] !== '')))
    .forEach(key => { _[key] = p[key]; });
  keepValues.forEach(k => { if (p[k] !== undefined) { _[k] = p[k]; } });
  return _;
}

export function selectObjectByKeys(p: object = {}, keys: string[] = []): any {
  const _ = {};
  Object.keys(p).filter(key => keys.includes(key)).forEach(key => { _[key] = p[key]; });
  return _;
}
// not sure about this one
export function removeUselessObject(p: object = {}, keys: string[] | (() => any)): any {
  if (typeof keys === 'function') {
    Object.keys(p).filter((k: string) => keys.call(this, k, p[k])).forEach((k: string) => delete p[k]);
  } else {
    keys.filter((k: string) => p.hasOwnProperty(k)).forEach((k: string) => delete p[k]);
  }
  return p;
}

export function isDocumentUID(uid: string): boolean {
  return uid && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/ig.test(uid);
}

export function getDocumentTypes(envTypes: string): string[] {
  return Array.from(JSON.parse(envTypes));
}

export function getPathPartOfUrl(url: string): string {
  return url.match(/.*?(?=[?;#]|$)/)[0];
}

export function parseTabRoute(tabConfig: any[], routeParams?: any): any[] {
  const tabs: any[] = [];
  for (const config of tabConfig) {
    if (config.hidden === undefined || !config.hidden) {
      const tab: any = Object.assign({}, config);
      if (routeParams) {
        for (const key of ['type', 'id']) {
          tab.route = tab.route.replace(`:${key}`, routeParams[key]);
        }
      }
      tabs.push(tab);
    }
  }
  return tabs;
}

export function vocabularyFormatter(list: string[]): string {
  return list.map((x) => x.split('/').pop()).join(', ');
}

export function isValueEmpty(n: any): boolean {
  return n !== 0 && !(!!n ? typeof n === 'object' ? Array.isArray(n) ? !!n.length : !!Object.keys(n).length : true : false);
}

export function objHasKey(obj: any, name: string = ''): boolean {
  return obj && typeof obj === 'object' && Object.getOwnPropertyNames(obj).some((key: string) => key.includes(name));
}

export function convertToBoolean(val: any): boolean {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();
    return (val === 'true' || val === '');
  }
  return !!val;
}

export function assetPath(src: string): string {
  return Environment.assetPath + src;
}

export function getAssetModuleType(doc: any): string {
  let type = '';
  if (NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES.includes(doc.type)) {
    type = 'Creative';
  } else if (NUXEO_DOC_TYPE.BACKSLASH_ARTICLE_VIDEO_TYPES.includes(doc.type)) {
    type = 'Backslash';
  } else if (NUXEO_DOC_TYPE.INTELLIGENCE_ASSET_TYPE.includes(doc.type)) {
    type = 'Intelligence';
  } else if (NUXEO_DOC_TYPE.INNOVATION_ASSET_TYPE.includes(doc.type)) {
    type = 'Innovation';
  } else if (NUXEO_DOC_TYPE.BIZ_DEV_ASSET_TYPE.includes(doc.type)) {
    type = 'Business Development';
  } else if (NUXEO_DOC_TYPE.DISRUPTION_ASSET_TYPE.includes(doc.type)) {
    type = 'Disruption';
  }
  return type;
}

export function mapOrder(array: any[], order: any[], key: string): any[] {
  return array.sort((a, b) => order.indexOf(a[key]) < order.indexOf(b[key]) || order.indexOf(a[key]) === -1 || order.indexOf(b[key]) === -1 ? -1 : 1);
}
