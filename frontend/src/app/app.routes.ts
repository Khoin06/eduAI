// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './interceptors/auth.guard';
import { adminGuard } from './interceptors/admin.guard';
import { studentGuard } from './interceptors/student.guard';

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
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
     canActivate: [studentGuard],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./admin/dashboard/dashboard').then((c) => c.Dashboard),
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./pages/courses/course-manager/course-manager.component').then(
        (m) => m.CourseManagementComponent
      ),
           canActivate: [studentGuard],
  },
    {
    path: 'admin/courses',
    loadComponent: () =>
      import('./admin/courses/courses').then(
        (m) => m.Courses
      ),
       canActivate: [adminGuard],
  },

  {
    path: 'course/:id',
    loadComponent: () =>
      import('./pages/courses/course-detail/course-detail.component').then((m) => m.CourseDetailComponent),
         canActivate: [studentGuard],

  },
  { path: 'admin/course/:id',
    loadComponent: () =>
      import('./admin/course-detail/course-detail').then((m) => m.CourseDetail),
canActivate: [adminGuard],
  },
  {
    path: 'lesson/:id',
    loadComponent: () =>
      import('./pages/lesson-detail/lesson-detail.component').then((m) => m.LessonDetailComponent),
         canActivate: [studentGuard],

  },
    {
    path: 'admin/lesson/:id',
    loadComponent: () =>
      import('./admin/lesson-detail/lesson-detail').then(
        (m) => m.LessonDetail
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'certificates',
    loadComponent: () => import('./pages/certificates/certificates').then((m) => m.Certificates),
  },
  {
    path: 'progress',
    loadComponent: () => import('./pages/progress/progress').then((m) => m.Progress),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'chat/:lessonId',
    loadComponent: () =>
      import('./chat/chat-box/chat-box.component').then((m) => m.ChatBoxComponent),
  },
  { path: '**', redirectTo: '/login' },
];
