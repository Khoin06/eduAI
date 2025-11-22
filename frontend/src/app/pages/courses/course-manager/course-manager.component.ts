import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FilterPipe } from '../../../pipes/filter.pipe';


declare var bootstrap: any;

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterPipe],
  templateUrl: './course-manager.component.html',
    styleUrl: './course-manager.component.css'

})
export class CourseManagementComponent implements OnInit {
  @ViewChild('addModal') addModal!: ElementRef;

  userCourses: any[] = [];   // các khóa học của user
  allCourses: any[] = [];    // danh sách toàn bộ khóa học
  selectedCourses: number[] = [];
  searchTerm = '';
  userId!: number;
  private modalInstance: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadUserId();

    if (!this.userId) {
      alert('Vui lòng đăng nhập!');
      return;
    }

    // chỉ tải khóa học của user
    this.loadUserCourses();
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.addModal.nativeElement);
  }

  /**
   * ✅ Lấy userId từ localStorage
   */
  loadUserId() {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    if (user?.id) {
      this.userId = user.id;
      console.log('🧑‍💻 userId hiện tại:', this.userId);
    } else {
      this.userId = 0;
    }
  }

  /**
   * ✅ Lấy danh sách khóa học mà user đã đăng ký
   */
  loadUserCourses() {
    const url = `http://localhost:8080/api/courses/my-courses/${this.userId}`;
    console.log('📡 Gọi API lấy khóa học user:', url);

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.userCourses = data;
        console.log('✅ Khóa học của user:', this.userCourses);
      },
      error: (err) => {
        console.error('❌ Lỗi loadUserCourses:', err);
        alert('Không thể tải danh sách khóa học!');
      },
    });
  }

  /**
   * ✅ Lấy toàn bộ khóa học (dùng cho modal “Thêm khóa học”)
   */
loadAllCourses() {
  const url = `http://localhost:8080/api/courses/unselected?userId=${this.userId}`;
  console.log('📡 Gọi API lấy khóa học chưa chọn:', url);

  this.http.get<any[]>(url).subscribe({
    next: (data) => {
      this.allCourses = data;
      console.log('✅ Khóa học chưa chọn:', this.allCourses);
    },
    error: (err) => {
      console.error('❌ Lỗi loadAllCourses:', err);
      alert('Không thể tải danh sách khóa học chưa chọn!');
    },
  });
}

  /**
   * ✅ Mở modal thêm khóa học
   */
  openAddModal() {
    this.loadAllCourses(); // chỉ gọi khi mở modal
    this.selectedCourses = [];
    this.searchTerm = '';
    this.modalInstance.show();
  }

  /**
   * ✅ Chọn / Bỏ chọn khóa học khi thêm mới
   */
  toggleSelect(courseId: number) {
    const index = this.selectedCourses.indexOf(courseId);
    if (index === -1) this.selectedCourses.push(courseId);
    else this.selectedCourses.splice(index, 1);
  }

  /**
   * ✅ Thêm các khóa học đã chọn vào user_courses
   */
  addSelected() {
    if (this.selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất một khóa học.');
      return;
    }

    const payload = this.selectedCourses.map(courseId => ({
      userId: this.userId,
      courseId,
    }));

    console.log('📤 Gửi payload thêm khóa:', payload);

    this.http.post('http://localhost:8080/api/user-courses/batch', payload)
      .subscribe({
        next: () => {
          this.loadUserCourses();
          this.selectedCourses = [];
          this.modalInstance.hide();
        },
        error: (err) => {
          console.error('❌ Thêm khóa học thất bại:', err);
          alert('Không thể thêm khóa học!');
        },
      });
  }

  /**
   * ❌ Xóa khóa học khỏi danh sách user_courses
   */
removeFromUser(courseId: number) {
  if (confirm('Xóa khỏi danh sách của bạn?')) {
    this.http
      .delete(`http://localhost:8080/api/user-courses?userId=${this.userId}&courseId=${courseId}`, { responseType: 'json' })
      .subscribe({
        next: (res: any) => {
          console.log('✅ Xóa thành công:', res);
          this.loadUserCourses();
        },
        error: (err) => {
          console.error('❌ Xóa thất bại:', err);
          alert(err.error?.message || 'Không thể xóa khóa học!');
        }
      });
  }
}


  /**
   * 🔗 Điều hướng đến chi tiết khóa học
   */
  goToCourseDetail(courseId: number) {
    this.router.navigate(['/course', courseId]);
  }
}
