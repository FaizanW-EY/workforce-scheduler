import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatWith } from 'rxjs';
@Component({
  selector: 'app-createuser',
  standalone: false,
  templateUrl: './createuser.html',
  styleUrls: ['./createuser.css']
})

export class CreateUser {
  test='visible';
 email = '';
 password = '';
 roleId = 3;
 success = '';
 error = '';
 constructor(private http: HttpClient) {
 ;
  
 }
 create() {
 const token = localStorage.getItem('token');
 const body = {
   email: this.email,
   password: this.password,
   roleId: Number(this.roleId)
 };
 this.http.post(
   'https://localhost:7088/api/users/create',
   body,
   {
     headers: {
       'Content-Type': 'application/json',
       Authorization: 'Bearer ' + token
     },
     responseType: 'text'
   }
 ).subscribe({
   next: res => {
     this.success = res;
     this.error = '';
   },
   error: err => {
     console.log(err);
     this.error = err.error || 'Error creating user';
     this.success = '';
   }
 });
}
}