import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class AuthService {

  private api = 'https://localhost:7088/api/auth/login';

  constructor(private http: HttpClient) {}

  login(data: any) {

    return this.http.post<any>(this.api, data);

  }

  setToken(token: string) {

    localStorage.setItem('token', token);

  }

  getToken() {

    return localStorage.getItem('token');

  }

  getRole() {

    const token = this.getToken();

    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));

    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  }

}
 
