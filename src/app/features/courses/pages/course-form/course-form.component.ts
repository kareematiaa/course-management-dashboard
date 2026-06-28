import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CourseService } from '../../services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { COURSE_CATEGORIES, COURSE_STATUSES } from '../../../../shared/constants/course.constants';
import { CourseDto } from '../../models/course.interface';

@Component({
  standalone: true,
  selector: 'app-course-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  categories = COURSE_CATEGORIES;
  statuses = COURSE_STATUSES;
  isEditMode = false;
  isLoading = false;
  courseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId && this.route.snapshot.url.some((s) => s.path === 'edit');
    if (this.isEditMode && this.courseId) {
      this.loadCourseData(this.courseId);
    }
  }

  private initForm(): void {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      instructorName: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      status: ['Draft', Validators.required],
      description: ['', Validators.maxLength(500)],
    });
  }

  private loadCourseData(id: string): void {
    this.isLoading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue(course);
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load course data');
        this.isLoading = false;
        this.router.navigate(['/courses']);
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.courseForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.courseForm.get(field);
    if (!control) return '';
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength'))
      return `Minimum ${control.errors?.['minlength'].requiredLength} characters`;
    if (control.hasError('maxlength'))
      return `Maximum ${control.errors?.['maxlength'].requiredLength} characters`;
    if (control.hasError('min')) return `Minimum value is ${control.errors?.['min'].min}`;
    return '';
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const courseData: CourseDto = this.courseForm.value;

    const request$ =
      this.isEditMode && this.courseId
        ? this.courseService.updateCourse(this.courseId, courseData)
        : this.courseService.createCourse(courseData);

    request$.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isEditMode ? 'Course updated successfully' : 'Course created successfully',
        );
        this.isLoading = false;
        this.router.navigate(['/courses']);
      },
      error: () => {
        this.notificationService.showError(
          this.isEditMode ? 'Failed to update course' : 'Failed to create course',
        );
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }
}
