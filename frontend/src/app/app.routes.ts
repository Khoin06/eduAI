// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./course/course-list/course-list.component').then((m) => m.CourseListComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'course/:id',
    loadComponent: () =>
      import('./course/course-detail/course-detail.component').then((m) => m.CourseDetailComponent),
  },
  {
    path: 'lesson/:id',
    loadComponent: () =>
      import('./lesson/lesson-viewer/lesson-viewer.component').then((m) => m.LessonViewerComponent),
  },
  // { path: 'chat/:id', loadComponent: () => import('./chat-box/chat-box.component').then(m => m.ChatBoxComponent) },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: '' },
];
