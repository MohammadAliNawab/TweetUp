import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}
  setLocalStorage(responseObj: any) {
    // Adds the expiration time defined on the JWT to the current moment
    const expiresAt = moment().add(
      Number.parseInt(responseObj.expiresIn),
      'days'
    );

    localStorage.setItem('id_token', responseObj.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.router.navigate(['home']);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration(), 'second');
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      return moment();
    }
  }
}
