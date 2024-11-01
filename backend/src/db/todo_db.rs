use sqlx::types::JsonValue;
use sqlx::{FromRow, PgPool};
use crate::models::todo_item::ToDoItem;
use chrono::NaiveDateTime;

#[derive(FromRow)]
struct TodoItemRow {
    id: i32,
    item_name: String,
    due_date: Option<NaiveDateTime>,
    task_category: String,  
    recurring_type: Option<JsonValue>,
    done: bool,
}

impl From<TodoItemRow> for ToDoItem {
    fn from(row: TodoItemRow) -> Self {
        ToDoItem {
            id: row.id,
            item_name: row.item_name,
            due_date: row.due_date,
            task_category: row.task_category,
            recurring_type: row.recurring_type
                .and_then(|v| serde_json::from_value(v).ok()),
            done: row.done,
        }
    }
}

pub async fn add_todo_item(pool: &PgPool, item: &ToDoItem) -> Result<ToDoItem, sqlx::Error> {
    let recurring_type = item.recurring_type.as_ref()
        .map(|rt| serde_json::to_value(rt))
        .transpose()
        .map_err(|e| sqlx::Error::Protocol(e.to_string()))?;

    let row = sqlx::query_as::<_, TodoItemRow>(
        r#"
        INSERT INTO todo_items (item_name, due_date, task_category, recurring_type, done) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, item_name, due_date::timestamp, task_category, recurring_type, done
        "#
    )
    .bind(&item.item_name)
    .bind(&item.due_date)
    .bind(&item.task_category)
    .bind(&recurring_type)
    .bind(item.done)
    .fetch_one(pool)
    .await?;

    Ok(row.into())
}

pub async fn get_all_items(pool: &PgPool) -> Result<Vec<ToDoItem>, sqlx::Error> {
    let rows = sqlx::query_as::<_, TodoItemRow>(
        r#"
        SELECT id, item_name, due_date::timestamp, task_category, recurring_type, done 
        FROM todo_items
        "#
    )
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(Into::into).collect())
}

pub async fn get_item_by_id(pool: &PgPool, id: i32) -> Result<Option<ToDoItem>, sqlx::Error> {
    let maybe_row = sqlx::query_as::<_, TodoItemRow>(
        r#"
        SELECT id, item_name, due_date::timestamp, task_category, recurring_type, done 
        FROM todo_items 
        WHERE id = $1
        "#
    )
    .bind(id)
    .fetch_optional(pool)
    .await?;

    Ok(maybe_row.map(Into::into))
}

pub async fn update_todo_item(pool: &PgPool, item: &ToDoItem) -> Result<ToDoItem, sqlx::Error> {
    let recurring_type = item.recurring_type.as_ref()
        .map(|rt| serde_json::to_value(rt))
        .transpose()
        .map_err(|e| sqlx::Error::Protocol(e.to_string()))?;

    let row = sqlx::query_as::<_, TodoItemRow>(
        r#"
        UPDATE todo_items 
        SET item_name = $1, due_date = $2, task_category = $3, recurring_type = $4, done = $5 
        WHERE id = $6 
        RETURNING id, item_name, due_date::timestamp, task_category, recurring_type, done
        "#
    )
    .bind(&item.item_name)
    .bind(&item.due_date)
    .bind(&item.task_category)
    .bind(&recurring_type)
    .bind(item.done)
    .bind(item.id)
    .fetch_one(pool)
    .await?;

    Ok(row.into())
}

// Helper function to filter items by category
pub async fn get_items_by_category(pool: &PgPool, category: &str) -> Result<Vec<ToDoItem>, sqlx::Error> {
    let rows = sqlx::query_as::<_, TodoItemRow>(
        r#"
        SELECT id, item_name, due_date::timestamp, task_category, recurring_type, done 
        FROM todo_items 
        WHERE task_category = $1
        "#
    )
    .bind(category)
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(Into::into).collect())
}


pub async fn delete_todo_item(pool: &PgPool, item: &ToDoItem) -> Result<ToDoItem, sqlx::Error> {
    let row = sqlx::query_as::<_, TodoItemRow>(
        r#"
        DELETE FROM todo_items
        WHERE id = $1
        RETURNING id, item_name, due_date::timestamp, task_category, recurring_type, done
        "#,
    )
    .bind(item.id)
    .fetch_one(pool)
    .await?;

    Ok(row.into()) // Use the From implementation instead of manual conversion
}
