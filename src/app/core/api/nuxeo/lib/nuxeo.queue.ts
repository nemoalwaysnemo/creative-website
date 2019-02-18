
export class Queue {
  private options: any;
  private pendingPromises: number;
  private maxPendingPromises: number;
  private maxQueuedPromises: number;
  private queue: any[];
  private static localPromise: any;

  static configure(globalPromise) {
    this.localPromise = globalPromise;
  }

  constructor(maxPendingPromises = Infinity, maxQueuedPromises = Infinity, options = {}) {
    this.options = options;
    this.pendingPromises = 0;
    this.maxPendingPromises = maxPendingPromises;
    this.maxQueuedPromises = maxQueuedPromises;
    this.queue = [];
  }

  add(promiseGenerator): any {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.queue.length >= self.maxQueuedPromises) {
        reject(new Error('Queue limit reached'));
        return;
      }

      self.queue.push({
        promiseGenerator: promiseGenerator,
        resolve: resolve,
        reject: reject,
        // notify: notify || noop
      });
      self._dequeue();
    });
  }

  getPendingLength(): number {
    return this.pendingPromises;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  resolveWith(value): any {
    if (value && typeof value.then === 'function') {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  }

  private _dequeue(): boolean {
    const self = this;
    if (this.pendingPromises >= this.maxPendingPromises) {
      return false;
    }

    // Remove from queue
    const item = this.queue.shift();
    if (!item) {
      if (this.options.onEmpty) {
        this.options.onEmpty();
      }
      return false;
    }

    try {
      this.pendingPromises = this.pendingPromises + 1;

      this.resolveWith(item.promiseGenerator)
        // Forward all stuff
        .then(function (value) {
          // It is not pending now
          self.pendingPromises = self.pendingPromises - 1;
          // It should pass values
          item.resolve(value);
          self._dequeue();
        }, function (err) {
          // It is not pending now
          self.pendingPromises = self.pendingPromises - 1;
          // It should not mask errors
          item.reject(err);
          self._dequeue();
        });
    } catch (err) {
      self.pendingPromises = self.pendingPromises - 1;
      item.reject(err);
      self._dequeue();
    }
    return true;
  }

}
