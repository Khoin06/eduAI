// src/app/course/course-list/course-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';


@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent {
  courses: any[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getAll().subscribe(data => {
      this.courses = data;
    });
  }
}