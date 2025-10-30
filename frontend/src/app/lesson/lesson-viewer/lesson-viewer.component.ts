// src/app/lesson/lesson-viewer/lesson-viewer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-lesson-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson-viewer.component.html',
  styleUrl: './lesson-viewer.component.css'
})
export class LessonViewerComponent {
  lesson = { title: 'Bài 1: Giới thiệu', type: 'pdf', url: '/assets/sample.pdf' };
}