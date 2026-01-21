import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth';
import {Profile} from '../../employee/profile/profile';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  role: string | null = '';

  constructor(private auth: AuthService, private router: Router) {
    this.role = this.auth.getRole();   //this.auth.getRole()
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  shiftsOpen = false;

  toggleShifts() {
  this.shiftsOpen = !this.shiftsOpen;
  }


}
