export function getWindow(): any { return window; }

export function acceptType(accept: string, type: string, name?: string): boolean {
  if (!accept) {
    return true;
  }

  const defs = accept.split(',');
  let regx: RegExp;
  let acceptRegString: string;

  for (let x = defs.length - 1; x >= 0; --x) {
    // Escapes dots in mimetype
    acceptRegString = defs[x];
    // trim
    acceptRegString = acceptRegString.replace(/(^\s+|\s+$)/g, '');
    // Escapes stars in mimetype
    acceptRegString = acceptRegString.replace(/\*/g, '.*');
    // let acceptReg = '^((' + acceptRegString
    // acceptReg = acceptReg.replace(/,/g,')|(') + '))$'

    // try by mime
    regx = new RegExp(acceptRegString, 'gi');
    if (type && type.search(regx) >= 0) {
      return true;
    }

    // try by ext
    if ((name || type) && acceptRegString.substring(0, 1) === '.') {
      acceptRegString = '\\' + acceptRegString; // .substring(1, acceptRegString.length-1)//remove dot at front
      regx = new RegExp(acceptRegString + '$', 'i');
      if ((name || type).search(regx) >= 0) {
        return true;
      }
    }
  }
  return false;
}

export interface InvalidFileItem {
  file: File;
  type: string;
}

export function arrayBufferToBase64(buffer: any): any {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function dataUrltoBlob(
  dataurl: string,
  name: string,
  origSize?: any,
): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime: string = mimeMatch ? mimeMatch[1] : 'text/plain';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blob = new window.Blob([u8arr], { type: mime });
  blob['name'] = name;
  blob['$ngfOrigSize'] = origSize;
  return blob;
}

export interface OrientationMeta {
  orientation: number;
  fixedArrayBuffer?: any[];
}

export function applyTransform(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number,
): any {
  switch (orientation) {
    case 2:
      return ctx.transform(-1, 0, 0, 1, width, 0);
    case 3:
      return ctx.transform(-1, 0, 0, -1, width, height);
    case 4:
      return ctx.transform(1, 0, 0, -1, 0, height);
    case 5:
      return ctx.transform(0, 1, 1, 0, 0, 0);
    case 6:
      return ctx.transform(0, 1, -1, 0, height, 0);
    case 7:
      return ctx.transform(0, -1, -1, 0, height, width);
    case 8:
      return ctx.transform(0, -1, 1, 0, 0, width);
  }
}

export function fixFileOrientationByMeta(
  file: File, result: OrientationMeta,
): Promise<Blob> {
  return dataUrl(file, true)
    .then(url => {
      const canvas = document.createElement('canvas');
      const img = document.createElement('img');

      return new Promise((res, rej) => {
        img.onload = () => {
          try {
            canvas.width = result.orientation > 4 ? img.height : img.width;
            canvas.height = result.orientation > 4 ? img.width : img.height;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            applyTransform(ctx, result.orientation, img.width, img.height);
            ctx.drawImage(img, 0, 0);
            let data = canvas.toDataURL(file.type || 'image/WebP', 0.934);
            const base = arrayBufferToBase64(result.fixedArrayBuffer);
            data = restoreExif(base, data);
            const blob = dataUrltoBlob(data, file.name);
            res(blob);
          } catch (e) {
            rej(e);
          }
        };
        img.onerror = rej;
        img.src = url;
      }) as Promise<Blob>;
    });
}

/** converts file-input file into base64 dataUri */
export function dataUrl(
  file: any,
  disallowObjectUrl?: any,
): Promise<string> {
  if (!file) { return Promise.resolve(file); }

  if ((disallowObjectUrl && file.$ngfDataUrl !== null) || (!disallowObjectUrl && file.$ngfBlobUrl !== null)) {
    return Promise.resolve(disallowObjectUrl ? file.$ngfDataUrl : file.$ngfBlobUrl);
  }

  let promise = disallowObjectUrl ? file.$$ngfDataUrlPromise : file.$$ngfBlobUrlPromise;
  if (promise) { return promise; }

  const win = getWindow();
  let deferred: Promise<string>;
  if (win.FileReader && file &&
    (!win.FileAPI || navigator.userAgent.indexOf('MSIE 8') === -1 || file.size < 20000) &&
    (!win.FileAPI || navigator.userAgent.indexOf('MSIE 9') === -1 || file.size < 4000000)) {
    // prefer URL.createObjectURL for handling refrences to files of all sizes
    // since it doesn´t build a large string in memory
    const URL = win.URL || win.webkitURL;
    if (FileReader) {
      deferred = new Promise((res, rej) => {
        const fileReader = new FileReader();
        fileReader.onload = (event: any) => {
          file.$ngfDataUrl = event.target.result;
          delete file.$ngfDataUrl;
          res(event.target.result);
        };
        fileReader.onerror = (e) => {
          file.$ngfDataUrl = '';
          rej(e);
        };
        fileReader.readAsDataURL(file);
      });
    } else {
      let url: any;
      try {
        url = URL.createObjectURL(file);
      } catch (e) {
        return Promise.reject(e);
      }

      deferred = Promise.resolve(url);
      file.$ngfBlobUrl = url;
    }
  } else {
    file[disallowObjectUrl ? '$ngfDataUrl' : '$ngfBlobUrl'] = '';
    return Promise.reject(new Error('Browser does not support window.FileReader, window.FileReader, or window.FileAPI')); // deferred.reject();
  }
  if (disallowObjectUrl) {
    promise = file.$$ngfDataUrlPromise = deferred;
  } else {
    promise = file.$$ngfBlobUrlPromise = deferred;
  }

  promise = promise.then((x: any) => {
    delete file[disallowObjectUrl ? '$$ngfDataUrlPromise' : '$$ngfBlobUrlPromise'];
    return x;
  });

  return promise;
}

export function restoreExif(orig: any, resized: any): string {
  const ExifRestorer: any = {
    KEY_STR: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  };

  ExifRestorer.encode64 = (input: any) => {
    let output = '',
      chr1, chr2, chr3: any = '',
      enc1, enc2, enc3, enc4: any = '',
      i = 0;

    do {
      chr1 = input[i++];
      chr2 = input[i++];
      chr3 = input[i++];

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this.KEY_STR.charAt(enc1) +
        this.KEY_STR.charAt(enc2) +
        this.KEY_STR.charAt(enc3) +
        this.KEY_STR.charAt(enc4);
      chr1 = chr2 = chr3 = '';
      enc1 = enc2 = enc3 = enc4 = '';
    } while (i < input.length);

    return output;
  };

  ExifRestorer.restore = (origFileBase64: any, resizedFileBase64: any): string => {
    if (origFileBase64.match('data:image/jpeg;base64,')) {
      origFileBase64 = origFileBase64.replace('data:image/jpeg;base64,', '');
    }

    const rawImage: number[] = this.decode64(origFileBase64);
    const segments = this.slice2Segments(rawImage);

    const image = this.exifManipulation(resizedFileBase64, segments);

    return 'data:image/jpeg;base64,' + this.encode64(image);
  };


  ExifRestorer.exifManipulation = (resizedFileBase64: any, segments: any): Uint8Array => {
    const exifArray = this.getExifArray(segments),
      newImageArray = this.insertExif(resizedFileBase64, exifArray);
    return new Uint8Array(newImageArray);
  };

  ExifRestorer.getExifArray = (segments: number[][]): any[] => {
    let seg;
    // tslint:disable-next-line:prefer-for-of
    for (let x = 0; x < segments.length; x++) {
      seg = segments[x];
      if (seg[0] === 255 && seg[1] === 225) { // (ff e1)
        return seg;
      }
    }
    return [];
  };


  ExifRestorer.insertExif = (resizedFileBase64: any, exifArray: any): any[] => {
    const imageData = resizedFileBase64.replace('data:image/jpeg;base64,', ''),
      buf = this.decode64(imageData),
      separatePoint = buf.indexOf(255, 3),
      mae = buf.slice(0, separatePoint),
      ato = buf.slice(separatePoint);
    let array = mae;

    array = array.concat(exifArray);
    array = array.concat(ato);
    return array;
  };


  ExifRestorer.slice2Segments = (
    rawImageArray: number[],
  ): any[] => {
    let head: number = 0;
    const segments: number[][] = [];

    while (1) {
      if (rawImageArray[head] === 255 && rawImageArray[head + 1] === 218) {
        break;
      }
      if (rawImageArray[head] === 255 && rawImageArray[head + 1] === 216) {
        head += 2;
      } else {
        const length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
        const endPoint = head + length + 2;
        const seg: number[] = rawImageArray.slice(head, endPoint);
        segments.push(seg);
        head = endPoint;
      }
      if (head > rawImageArray.length) {
        break;
      }
    }

    return segments;
  };


  ExifRestorer.decode64 = function(
    input: any,
  ): number[] {
    let chr1, chr2, chr3: any = '';
    let enc1, enc2, enc3, enc4: any = '';
    let i = 0;
    const buf: number[] = [];

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    const base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
      console.log('There were invalid base64 characters in the input text.');
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    do {
      enc1 = this.KEY_STR.indexOf(input.charAt(i++));
      enc2 = this.KEY_STR.indexOf(input.charAt(i++));
      enc3 = this.KEY_STR.indexOf(input.charAt(i++));
      enc4 = this.KEY_STR.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      buf.push(chr1);

      if (enc3 !== 64) {
        buf.push(chr2);
      }
      if (enc4 !== 64) {
        buf.push(chr3);
      }

      chr1 = chr2 = chr3 = '';
      enc1 = enc2 = enc3 = enc4 = '';

    } while (i < input.length);

    return buf;
  };

  return ExifRestorer.restore(orig, resized);  // <= EXIF
}
