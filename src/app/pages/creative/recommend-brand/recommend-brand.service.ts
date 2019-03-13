import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { share, distinctUntilChanged } from 'rxjs/operators';
import { DocumentModel } from '@core/api';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class RecommendBrandService {
  private brandMessage$ = new Subject<{ client, brand, agency, country, file, path }>();
  private _brand: DocumentModel;
  private message: { client, brand, agency, country, file, path };

  public set brand(brand: DocumentModel) {
    this._brand = brand;
  }

  public get brand(): DocumentModel {
    return this._brand;
  }

  hasBrand(): boolean {
    return !!this._brand;
  }

  changeMessage(message: { client, brand, agency, country, file, path }): void {
    this.message = message;
    this.brandMessage$.next(message);
  }

  onChangeMessage(): Observable<{ client, brand, agency, country, file, path }> {
    return this.brandMessage$.pipe(share());
  }
}
