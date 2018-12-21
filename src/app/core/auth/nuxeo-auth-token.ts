import { NbAuthToken } from '../nebular/auth';

export class NuxeoAuthToken extends NbAuthToken {

  static NAME = 'gcl:auth:nuxeo:token';
  private createdAt: Date;
  private ownerStrategyName: string = 'nuxeo';

  constructor(private readonly token: any) {
    super();
    this.createdAt = this.prepareCreatedAt(token.createdAt);
  }

  protected prepareCreatedAt(date?: Date) {
    return date ? new Date(date) : new Date();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getValue(): any {
    return this.token;
  }

  getOwnerStrategyName(): string {
    return this.ownerStrategyName;
  }

  isValid(): boolean {
    return !!this.getValue() && (!this.getTokenExpDate() || new Date() < this.getTokenExpDate());
  }

  getTokenExpDate(): Date {
    if (!this.token.hasOwnProperty('expiresIn')) {
      return null;
    }
    const expiredTime = new Date(this.createdAt.getTime() + Number(this.token.expiresIn) * 1000);
    return new Date(expiredTime);
  }

  toString(): string {
    return !!this.token ? this.token : '';
  }
}
