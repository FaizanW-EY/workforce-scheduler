import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
email = '';
 password = '';
 error = '';
 constructor(private auth: AuthService, private router: Router) {}
 login() {
   this.auth.login({
     email: this.email,
     password: this.password
   }).subscribe({
     next: res => {
       this.auth.setToken(res.token);
       const role = this.auth.getRole();
       if (role === 'Admin')
         this.router.navigate(['/admin']);
       else if( role === 'Employee')
         this.router.navigate(['/employee']);
        else if (role === 'Manager')
          this.router.navigate(['/manager']); 
      //this.router.navigate(['/admin']);
     },
     error: () => this.error = 'Invalid credentials'
   });

}
}

