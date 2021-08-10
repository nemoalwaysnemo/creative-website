/* eslint-disable prefer-arrow/prefer-arrow-functions */
export abstract class NbAuthToken {
  protected payload: any = null;
  abstract getValue(): string;
  abstract isValid(): boolean;
  // the strategy name used to acquire this token (needed for refreshing token)
  abstract getOwnerStrategyName(): string;
  abstract getCreatedAt(): Date;
  abstract toString(): string;

  getName(): string {
    return (this.constructor as NbAuthTokenClass).NAME;
  }

  getPayload(): any {
    return this.payload;
  }

  getTokenExpDate(): Date {
    return new Date();
  }
}

export class NbAuthTokenNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NbAuthIllegalTokenError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NbAuthEmptyTokenError extends NbAuthIllegalTokenError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface NbAuthRefreshableToken {
  getRefreshToken(): string;
  setRefreshToken(refreshToken: string): void;
}

export interface NbAuthTokenClass<T = NbAuthToken> {
  NAME: string;
  new(raw: any, strategyName: string, expDate?: Date): T;
}

export function nbAuthCreateToken<T extends NbAuthToken>(tokenClass: NbAuthTokenClass<T>, token: any, strategyName: string, createdAt?: Date): any {
  return new tokenClass(token, strategyName, createdAt);
}

/**
 * Wrapper for simple (text) token
 */
export class NbAuthSimpleToken extends NbAuthToken {

  static NAME = 'nb:auth:simple:token';

  constructor(protected readonly token: any, protected readonly strategyName: string, protected createdAt?: Date) {
    super();
    try {
      this.parsePayload();
    } catch (err) {
      if (!(err instanceof NbAuthTokenNotFoundError)) {
        // token is present but has got a problem, including illegal
        throw err;
      }
    }
    this.createdAt = this.prepareCreatedAt(createdAt);
  }

  protected parsePayload(): any {
    this.payload = null;
  }

  protected prepareCreatedAt(date: Date): Date {
    return date ? date : new Date();
  }

  /**
   * Returns the token's creation date
   * @returns {Date}
   */
  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Returns the token value
   * @returns string
   */
  getValue(): string {
    return this.token;
  }

  getOwnerStrategyName(): string {
    return this.strategyName;
  }

  /**
   * Is non empty and valid
   * @returns {boolean}
   */
  isValid(): boolean {
    return !!this.getValue();
  }

  /**
   * Validate value and convert to string, if value is not valid return empty string
   * @returns {string}
   */
  toString(): string {
    return !!this.token ? this.token : '';
  }
}

const prepareOAuth2Token = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) { }
  }
  return data;
};

/**
 * Wrapper for OAuth2 token whose access_token is a JWT Token
 */
export class NbAuthOAuth2Token extends NbAuthSimpleToken {

  static NAME = 'oauth2:token';

  constructor(data: { [key: string]: string | number } | string = {}, strategyName: string, createdAt?: Date) {

    // we may get it as string when retrieving from a storage
    super(prepareOAuth2Token(data), strategyName, createdAt);
  }

  /**
   * Returns the token value
   * @returns string
   */
  getValue(): string {
    return this.token.access_token;
  }

  /**
   * Returns the refresh token
   * @returns string
   */
  getRefreshToken(): string {
    return this.token.refresh_token;
  }

  /**
   *  put refreshToken in the token payload
   * @param refreshToken
   */
  setRefreshToken(refreshToken: string): void {
    this.token.refresh_token = refreshToken;
  }

  /**
   * Parses token payload
   * @returns any
   */
  protected parsePayload(): void {
    if (!this.token) {
      throw new NbAuthTokenNotFoundError('Token not found.');
    } else {
      if (!Object.keys(this.token).length) {
        throw new NbAuthEmptyTokenError('Cannot extract payload from an empty token.');
      }
    }
    this.payload = this.token;
  }

  /**
   * Returns the token type
   * @returns string
   */
  getType(): string {
    return this.token.token_type;
  }

  /**
   * Is data expired
   * @returns {boolean}
   */
  isValid(): boolean {
    return super.isValid() && (!this.getTokenExpDate() || new Date() < this.getTokenExpDate());
  }

  /**
   * Returns expiration date
   * @returns Date
   */
  getTokenExpDate(): Date {
    if (!this.token.hasOwnProperty('expires_in')) {
      return null;
    }
    return new Date(this.createdAt.getTime() + Number(this.token.expires_in) * 1000);
  }

  /**
   * Convert to string
   * @returns {string}
   */
  toString(): string {
    return JSON.stringify(this.token);
  }
}
