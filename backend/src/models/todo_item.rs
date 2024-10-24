use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub enum DayOfWeek {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
}

// Struct for complex recurrence patterns
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct RecurrencePattern {
    pub repeat_every: Option<u32>,       // E.g., repeat every '2' weeks
    pub days_of_week: Option<Vec<DayOfWeek>>, // E.g., Tuesday, Thursday
    pub total_repeats: Option<u32>,      // E.g., repeat 10 times
}

// Enum for different types of recurrence
#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub enum RecurringType {
    Daily,
    Weekly,
    Monthly,
    Yearly,
    CustomRecurrence(RecurrencePattern),  // Allows complex patterns
}

// ToDo item with RecurringType
#[derive(Debug, Serialize, Deserialize, Clone, FromRow)]
pub struct ToDoItem {
    pub id: i32,
    pub item_name: String,
    pub due_date: Option<NaiveDateTime>,
    pub task_category: String,
    pub recurring_type: Option<RecurringType>,
    pub done: bool,
}