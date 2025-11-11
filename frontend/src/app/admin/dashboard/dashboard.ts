import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  courses: any[] = [];
  totalCourses = 0;
  totalLessons = 0;
  totalUsers = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCourses();
    this.totalLessons = 120; // demo
    this.totalUsers = 45;    // demo
  }

  loadCourses() {
    this.http.get<any[]>('http://localhost:8080/api/admin/courses').subscribe({
      next: (res) => {
        this.courses = res;
        this.totalCourses = res.length;
      },
      error: () => alert('Không tải được danh sách khóa học')
    });
  }
}
