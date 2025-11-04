import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  imports: [],
  templateUrl: './progress.html',
  styleUrl: './progress.css',
})
export class Progress {
  progress = [
    { course: 'Angular từ A-Z', lessons: 45, percent: 75 },
    { course: 'ReactJS Pro', lessons: 38, percent: 45 },
    { course: 'Node.js & Express', lessons: 60, percent: 90 }
  ];

  get total() { return this.progress.length; }
  get completed() { return this.progress.filter(p => p.percent === 100).length; }
  get totalProgress() {
    return Math.round(this.progress.reduce((a, b) => a + b.percent, 0) / this.total);
  }
}