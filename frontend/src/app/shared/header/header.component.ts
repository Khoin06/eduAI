// src/app/shared/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;

  constructor(
    public authService: AuthService, // dùng public để truy cập trong template
    private router: Router
  ) {}

  ngOnInit() {
    // this.authService.isLoggedIn$.subscribe(loggedIn => {
    //   if (loggedIn) {
    //     this.currentUser = this.authService.getCurrentUser();
    //   } else {
    //     this.currentUser = null;
    //   }
    // });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}