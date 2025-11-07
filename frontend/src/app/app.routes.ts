// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './interceptors/auth.guard';

export const routes: Routes = [
    {
    path: '',
    redirectTo: '/login',
    // loadComponent: () =>
    //      import('./auth/login/login.component').then((m) => m.LoginComponent),
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canMatch: [authGuard]
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./admin/course-manager/course-manager.component').then(
        (m) => m.CourseManagementComponent
      ),
  },

  {
    path: 'course/:id',
    loadComponent: () =>
      import('./course/course-detail/course-detail.component').then((m) => m.CourseDetailComponent),
  },
  { path: 'admin/courses', 
    loadComponent: () =>
      import('./course/course-list/course-list.component').then((m) => m.CourseListComponent),
    //  canActivate: [adminGuard] 
    },
      {
    path: 'lesson/:id',
    loadComponent: () =>
      import('./pages/lesson-detail/lesson-detail.component').then(m => m.LessonDetailComponent)
  },
  {
    path: 'certificates',
    loadComponent: () =>
      import('./pages/certificates/certificates').then((m) => m.Certificates),
  },
  {
    path: 'progress',
    loadComponent: () =>
      import('./pages/progress/progress').then((m) => m.Progress),
  },
  { path: 'profile', 
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard] },
  {
    path: 'lesson/:id',
    loadComponent: () =>
      import('./lesson/lesson-viewer/lesson-viewer.component').then((m) => m.LessonViewerComponent),
  },
  {
    path: 'chat/:lessonId',
    loadComponent: () =>
      import('./chat/chat-box/chat-box.component').then((m) => m.ChatBoxComponent),
  },
  { path: '**', redirectTo: '/login' },
];
