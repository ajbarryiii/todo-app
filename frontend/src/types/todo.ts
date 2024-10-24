// src/types/todo.ts

// Similar to an enum in Rust
export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

// Similar to a struct in Rust
export interface RecurrencePattern {
  repeat_every?: number;
  days_of_week?: DayOfWeek[];
  total_repeats?: number;
}

// Similar to an enum with associated data in Rust
export type RecurringType = 
  | 'Daily'
  | 'Weekly'
  | 'Monthly'
  | 'Yearly'
  | { CustomRecurrence: RecurrencePattern };

// Main Todo item interface (like a struct in Rust)
export interface TodoItem {
  id: number;
  item_name: string;
  due_date?: string; // ISO 8601 string
  task_category: string;
  recurring_type?: RecurringType;
  done: boolean;
}

// Props are like function parameters for components
export interface TodoItemProps {
  todo: TodoItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface TodoFormProps {
  onAdd: (todo: Omit<TodoItem, 'id'>) => void;
}