// Define the Course interface - this is a contract for what a course object should look like
export interface Course {
  // Each course has a unique identifier
  id: string;

  // Name/title of the course (Required)
  courseName: string;

  // Name of the instructor (Required)
  instructorName: string;

  // Category - only these specific values are allowed
  category: 'Frontend' | 'Backend' | 'Design' | 'DevOps' | 'Mobile' | 'Data Science' | 'Other';

  // Duration in hours (Required, must be > 0)
  duration: number;

  // Price in USD (Required, must be >= 0)
  price: number;

  // Status - only these specific values are allowed
  status: 'Active' | 'Draft' | 'Archived';

  // Description (Optional, max 500 characters)
  description?: string;

  // When the course was created (automatically set)
  createdDate: string;
}

// Define the types for category and status separately for reuse
export type CourseStatus = 'Active' | 'Draft' | 'Archived';
export type CourseCategory =
  | 'Frontend'
  | 'Backend'
  | 'Design'
  | 'DevOps'
  | 'Mobile'
  | 'Data Science'
  | 'Other';

// This is used when creating or updating a course (without id and createdDate)
export interface CourseDto {
  courseName: string;
  instructorName: string;
  category: CourseCategory;
  duration: number;
  price: number;
  status: CourseStatus;
  description?: string;
}
