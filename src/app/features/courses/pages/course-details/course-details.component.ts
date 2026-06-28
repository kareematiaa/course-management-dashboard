import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Course } from '../../models/course.interface';
import { CourseService } from '../../services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-course-details',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCourseDetails();
  }

  private loadCourseDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notificationService.showError('Course ID not found');
      this.router.navigate(['/courses']);
      return;
    }
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.course = course;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.notificationService.showError('Failed to load course details');
        this.router.navigate(['/courses']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Active: 'green',
      Draft: 'orange',
      Archived: 'gray',
    };
    return colors[status] || 'default';
  }
}
