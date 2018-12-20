
import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  private users = {
    dean: { name: 'Dean Wang', picture: 'assets/images/user_icon.png' },
  };

  getUsers(): Observable<any> {
    return observableOf(this.users);
  }

}
