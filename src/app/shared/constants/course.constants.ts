// All possible course categories - used in dropdowns and filters
export const COURSE_CATEGORIES = [
  'Frontend',
  'Backend',
  'Design',
  'DevOps',
  'Mobile',
  'Data Science',
  'Other',
] as const; // 'as const' makes it read-only

// All possible course statuses
export const COURSE_STATUSES = ['Active', 'Draft', 'Archived'] as const;

// Color mapping for status badges
export const STATUS_COLORS: Record<string, string> = {
  Active: 'green',
  Draft: 'orange',
  Archived: 'gray',
};

// Table column configuration
export const COURSE_TABLE_COLUMNS = [
  'id',
  'courseName',
  'instructorName',
  'category',
  'duration',
  'price',
  'status',
  'actions',
];
