import { Routes } from '@angular/router';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/course-list/course-list.component').then((m) => m.CourseListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/course-form/course-form.component').then((m) => m.CourseFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/course-details/course-details.component').then(
        (m) => m.CourseDetailsComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/course-form/course-form.component').then((m) => m.CourseFormComponent),
  },
];
