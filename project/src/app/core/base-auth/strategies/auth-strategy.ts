import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NbAuthResult } from '../services/auth-result';
import { NbAuthStrategyOptions } from './auth-strategy-options';
import {
  NbAuthToken,
  nbAuthCreateToken,
  NbAuthIllegalTokenError,
} from '../services/token/token';
import { deepExtend, getDeepFromObject } from '@core/services/helpers';

export abstract class NbAuthStrategy {

  protected defaultOptions: NbAuthStrategyOptions;
  protected options: NbAuthStrategyOptions;

  // we should keep this any and validation should be done in `register` method instead
  // otherwise it won't be possible to pass an empty object
  setOptions(options: any): void {
    this.options = deepExtend({}, this.defaultOptions, options);
  }

  getOption(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }

  createToken<T extends NbAuthToken>(value: any, failWhenInvalidToken?: boolean): T {
    const token = nbAuthCreateToken<T>(this.getOption('token.class'), value, this.getName());
    // At this point, nbAuthCreateToken failed with NbAuthIllegalTokenError which MUST be intercepted by strategies
    // Or token is created. It MAY be created even if backend did not return any token, in this case it is !Valid
    if (failWhenInvalidToken && !token.isValid()) {
      // If we require a valid token (i.e. isValid), then we MUST throw NbAuthIllegalTokenError so that the strategies
      // intercept it
      throw new NbAuthIllegalTokenError('Token is empty or invalid.');
    }
    return token;
  }

  getName(): string {
    return this.getOption('name');
  }

  abstract authenticate(data?: any): Observable<NbAuthResult>;

  abstract logout(): Observable<NbAuthResult>;

  abstract refreshToken(data?: any): Observable<NbAuthResult>;

  protected createFailResponse(data?: any): HttpResponse<any> {
    return new HttpResponse<any>({ body: {}, status: 401 });
  }

  protected createSuccessResponse(data?: any): HttpResponse<any> {
    return new HttpResponse<any>({ body: {}, status: 200 });
  }

  protected getActionEndpoint(action: string): string {
    const actionEndpoint: string = this.getOption(`${action}.endpoint`);
    const baseEndpoint: string = this.getOption('baseEndpoint');
    return actionEndpoint ? baseEndpoint + actionEndpoint : '';
  }
}
