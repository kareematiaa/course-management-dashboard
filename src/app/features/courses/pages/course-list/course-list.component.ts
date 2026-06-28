import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CourseService } from '../../services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { Course } from '../../models/course.interface';

@Component({
  standalone: true,
  selector: 'app-course-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CurrencyPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'courseName',
    'instructorName',
    'category',
    'duration',
    'price',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Course>([]);
  isLoading = false;
  searchTerm = '';
  selectedStatus = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private courseService: CourseService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.dataSource.data = courses;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load courses');
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (data: Course, filter: string) => {
      const parsed = JSON.parse(filter);
      const matchesSearch = data.courseName.toLowerCase().includes(parsed.search.toLowerCase());
      const matchesStatus = parsed.status === '' || data.status === parsed.status;
      return matchesSearch && matchesStatus;
    };
    this.dataSource.filter = JSON.stringify({
      search: this.searchTerm,
      status: this.selectedStatus,
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Active: 'green',
      Draft: 'orange',
      Archived: 'gray',
    };
    return colors[status] || 'default';
  }

  onAddCourse(): void {
    this.router.navigate(['/courses/new']);
  }

  onViewCourse(id: string): void {
    this.router.navigate(['/courses', id]);
  }

  onEditCourse(id: string): void {
    this.router.navigate(['/courses', id, 'edit']);
  }

  onDeleteCourse(id: string, courseName: string): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Delete Course',
        message: `Are you sure you want to delete "${courseName}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.courseService.deleteCourse(id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Course deleted successfully');
            this.loadCourses();
          },
          error: () => {
            this.notificationService.showError('Failed to delete course');
          },
        });
      }
    });
  }
}
