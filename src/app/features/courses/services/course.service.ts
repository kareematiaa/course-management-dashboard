import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Course, CourseDto } from '../models/course.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root', // Available everywhere
})
export class CourseService {
  // API URL from environment configuration
  private apiUrl = environment.apiUrl;

  // BehaviorSubject to cache courses and notify subscribers of changes
  private coursesSubject = new BehaviorSubject<Course[]>([]);

  // Expose as observable for components
  courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Fetch all courses from the API
   * Updates the coursesSubject with the fetched data
   */
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`).pipe(
      // When data arrives, update the subject
      tap((courses) => this.coursesSubject.next(courses)),
      // Handle any errors
      catchError(this.handleError),
    );
  }

  /**
   * Get a single course by ID
   */
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Create a new course
   */
  // createCourse(course: CourseDto): Observable<Course> {
  //   // Add createdDate automatically
  //   const newCourse = {
  //     ...course,
  //     createdDate: new Date().toISOString(),
  //   };

  //   return this.http.post<Course>(`${this.apiUrl}/courses`, newCourse).pipe(
  //     // After successful creation, update the cached courses
  //     tap((newCourseData) => {
  //       const current = this.coursesSubject.value;
  //       this.coursesSubject.next([...current, newCourseData]);
  //     }),
  //     catchError(this.handleError),
  //   );
  // }
  createCourse(course: CourseDto): Observable<Course> {
    const current = this.coursesSubject.value;

    // Generate next numeric ID based on existing courses
    const maxId = current.length > 0 ? Math.max(...current.map((c) => parseInt(c.id))) : 0;

    const newCourse = {
      ...course,
      id: (maxId + 1).toString(),
      createdDate: new Date().toISOString(),
    };

    return this.http.post<Course>(`${this.apiUrl}/courses`, newCourse).pipe(
      tap((newCourseData) => {
        this.coursesSubject.next([...current, newCourseData]);
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Update an existing course
   */
  updateCourse(id: string, course: CourseDto): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}`, course).pipe(
      // After successful update, update the cached courses
      tap((updatedCourse) => {
        const current = this.coursesSubject.value;
        const index = current.findIndex((c) => c.id === id);
        if (index !== -1) {
          current[index] = updatedCourse;
          this.coursesSubject.next([...current]);
        }
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Delete a course by ID
   */
  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${id}`).pipe(
      // After successful deletion, remove from cache
      tap(() => {
        const current = this.coursesSubject.value;
        this.coursesSubject.next(current.filter((c) => c.id !== id));
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Get the current cached courses
   * Used for filtering without making extra API calls
   */
  getCurrentCourses(): Course[] {
    return this.coursesSubject.value;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    // Return a user-friendly error message
    return throwError(() => new Error(error.message || 'An error occurred. Please try again.'));
  }
}
