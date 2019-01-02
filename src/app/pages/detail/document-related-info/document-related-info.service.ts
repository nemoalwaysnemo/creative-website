import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { DocumentModel } from '@core/api';
import { SearchDataSource } from '@pages/shared';

export interface DocumentsBag { name: string; documents: DocumentModel[] }

@Injectable()
export class DocumentRelatedInfoService {

  protected documentsBag$ = new Subject<DocumentsBag>();

  constructor(protected searchDataSource: SearchDataSource) {
  }

  onChangeTab(): Observable<DocumentsBag> {
    return this.documentsBag$.pipe(share());
  }

  search(searchTerm: string, opts: any) {
    this.searchDataSource.searchForText(searchTerm, opts.params).subscribe(res => {
      this.documentsBag$.next({ name: opts.name, documents: res.entries });
    });
  }
}
