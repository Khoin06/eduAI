// src/app/app.component.ts
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { HeaderComponent } from "./shared/header/header.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn = false;

constructor(private authService: AuthService, private router: Router) {
this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isLoggedIn = !!localStorage.getItem('token'); // ← KIỂM TRA TOKEN
      });

    // KIỂM TRA LẦN ĐẦU
    this.isLoggedIn = !!localStorage.getItem('token');
  }
    ngOnInit() {
    // ✅ Lắng nghe trạng thái đăng nhập
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
       if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    }
  }
}