import { Subject } from 'rxjs/Subject';
import { Observable, forkJoin } from 'rxjs';
import { BatchBlob } from './nuxeo.batch-blob';

export class PendingRequest {
  constructor(readonly func: Function) {
  }
}

export class BatchUploadQueueEvent {

  constructor(public action: string, public data?: any) {
  }
}

export class BatchUploadQueue {
  // This is your private requests queue emitter.
  private concurrency: number = 5;
  private event = new Subject<BatchUploadQueueEvent>();
  private queue: PendingRequest[] = [];
  private running: boolean = false;

  constructor() {
    // subscribe to that queue up there
    // this.addRequestToQueue.bind(this);
    // this.execute.bind(this);
    // this.requests$.subscribe(request => this.execute(request));
  }

  get event$(): Subject<BatchUploadQueueEvent> {
    return this.event;
  }

  start(): void {
    if (!this.running) {
      this.running = true;
      this.startNextGroup();
      this.event.next({ action: 'onStart' });
    }
  }

  addFileToQueue(upload: Function): void {
    this.queue.push(new PendingRequest(upload));
    if (this.running && this.queue.length >= 0) {
      this.startNextGroup();
    }
  }

  private executeBatch(pendings: PendingRequest[]): void {
    forkJoin(pendings.map((pending) => this.execute(pending))).subscribe((blobs: BatchBlob[]) => {
      this.queue.splice(0, pendings.length);
      this.event.next({ action: 'onExecute', data: blobs });
      console.log(blobs);
    });
  }

  private execute(pending: PendingRequest): Observable<BatchBlob> {
    return pending.func();
  }

  private startNextGroup(): void {
    const pendings = this.queue.slice(0, this.concurrency);
    if (pendings && pendings.length !== 0 && pendings.length <= this.concurrency) {
      this.executeBatch(pendings);
    }
  }

}
