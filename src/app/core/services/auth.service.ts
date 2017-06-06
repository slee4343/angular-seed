import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import * as fromRoot from '../../reducers';
import * as auth from '../../actions/auth';

import { UserService } from '../../shared/user.service';
import { User } from '../models';

export const MOCK_USER = new User();
MOCK_USER._id = '1';
MOCK_USER.email = 'foo@test.com';
MOCK_USER.firstName = 'Foo';
MOCK_USER.lastName = 'Bar';
MOCK_USER.password = 'password';

@Injectable()
export class AuthService {

  redirectUrl: string;
  private _isAuthenticated = false;

  constructor(
    private store: Store<fromRoot.State>,
    private userApi: UserService
  ) {
    const cookie = localStorage.getItem('seed-app-logged-in') || null;
    if (cookie) {
      this.store.dispatch(new auth.AuthenticatedAction({ token: cookie }));
    }
  }

  public authenticate(email: string, password: string): Observable<User> {
    // TODO: http request to authenticate
    return this.userApi.getUsers()
      .map(users => {
        for (const user of users) {
          if (user.email === email) {
            if (user.password !== password) {
              return Observable.throw(new Error('Invalid password'));
            }
            localStorage.setItem('seed-app-logged-in', 'alksdjfl;asjdflkj');
            this._isAuthenticated = true;
            return Observable.of(user);
          }
        }

        return Observable.throw(new Error('Invalid email'));
      });

    /*return this.userApi.findUser(email)
      .map(user => {
        console.log('user', user);
        if (Object.keys(user).length === 0 && user.constructor === Object) {
          return Observable.throw(new Error('Invalid email'));
        }

        if (user.password === password) {
          localStorage.setItem('seed-app-logged-in', 'alksdjfl;asjdflkj');
          this._isAuthenticated = true;
          return Observable.of(user);
        } else {
          return Observable.throw(new Error('Invalid password'));
        }
      });*/
  }

  public isAuthenticated(): Observable<boolean> {
    return Observable.of(this._isAuthenticated);
  }

  public isAuthenticatedUser(): Observable<User> {
    // TODO: http request to verify session
    this._isAuthenticated = true;
    return Observable.of(MOCK_USER);
  }

  public create(user: User): Observable<User> {
    // TODO: http request to create user
    this._isAuthenticated = true;
    return Observable.of(user);
  }

  public signOut(): Observable<boolean> {
    // TODO: http request to end session
    localStorage.removeItem('seed-app-logged-in');
    this.store.dispatch(go('/login'));
    this._isAuthenticated = false;
    return Observable.of(true);
  }

}
