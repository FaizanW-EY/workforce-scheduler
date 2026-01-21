import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
 selector: 'app-profile',
 templateUrl: './profile.html',
 styleUrls: ['./profile.css'],
 standalone: false
})
export class Profile {
 profile = {
   fullName: '',
   department: '',
   designation: '',
   maxWeeklyHours: 0
 };
 mode: 'none' | 'view' | 'edit' = 'none';
 success = '';
 constructor(private http: HttpClient) {}
 viewProfile() {
   this.http.get<any>(
     'https://localhost:7088/api/profile',
     {
       headers: {
         Authorization: 'Bearer ' + localStorage.getItem('token')
       }
     }
   ).subscribe(res => {
     if (res) {
       this.profile.fullName = res.fullName ?? res.FullName;
       this.profile.department = res.department ?? res.Department;
       this.profile.designation = res.designation ?? res.Designation;
       this.profile.maxWeeklyHours = res.maxWeeklyHours ?? res.MaxWeeklyHours;
     }
     this.mode = 'view';
   });
 }
 editProfile() {
   this.mode = 'edit';
 }
 save() {
   this.http.post(
     'https://localhost:7088/api/profile',
     this.profile,
     {
       headers: {
         Authorization: 'Bearer ' + localStorage.getItem('token')
       },
       responseType: 'text'
     }
   ).subscribe(res => {
     this.success = res;
     this.mode = 'view';
   });
 }
}