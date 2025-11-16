// src/app/pages/profile/profile.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.user = authService.getCurrentUser();
  }
}