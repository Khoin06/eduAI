// src/app/lesson/pdf-viewer/pdf-viewer.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent {
  @Input() url = '';
}