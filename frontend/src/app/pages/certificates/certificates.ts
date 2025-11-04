import { Component } from '@angular/core';

@Component({
  selector: 'app-certificates',
  imports: [],
  templateUrl: './certificates.html',
  styleUrl: './certificates.css',
})
export class Certificates {
  certificates = [
    { name: 'Chứng chỉ Angular Pro', course: 'Angular từ A-Z', date: '15/10/2025' },
    { name: 'Chứng chỉ React Master', course: 'ReactJS Pro', date: '20/09/2025' }
  ];
}