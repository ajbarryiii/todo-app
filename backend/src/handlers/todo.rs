// handlers/todo.rs
use actix_web::{get, post, put, delete, web, HttpResponse, Result};
use serde_json::json;
use crate::db::todo_db;
use crate::models::todo_item::ToDoItem;
use log::{error, debug};

#[get("/todos")]
async fn get_todos(pool: web::Data<sqlx::PgPool>) -> Result<HttpResponse> {
    debug!("Fetching all todos");
    match todo_db::get_all_items(&pool).await {
        Ok(items) => {
            debug!("Successfully fetched {} todos", items.len());
            Ok(HttpResponse::Ok().json(items))
        },
        Err(e) => {
            error!("Failed to fetch todos: {}", e);
            Ok(HttpResponse::InternalServerError()
                .json(json!({
                    "error": "Failed to fetch todos",
                    "details": e.to_string()
                })))
        }
    }
}

#[post("/todos")]
async fn create_todo(
    pool: web::Data<sqlx::PgPool>,
    item: web::Json<ToDoItem>
) -> Result<HttpResponse> {
    debug!("Creating new todo: {:?}", item);
    match todo_db::add_todo_item(&pool, &item).await {
        Ok(created_item) => {
            debug!("Successfully created todo with id: {:?}", created_item.id);
            Ok(HttpResponse::Created().json(created_item))
        },
        Err(e) => {
            error!("Failed to create todo: {}", e);
            Ok(HttpResponse::InternalServerError()
                .json(json!({
                    "error": "Failed to create todo",
                    "details": e.to_string()
                })))
        }
    }
}

#[delete("/todos/{id}")]  // Note the route pattern
async fn delete_todo(
    pool: web::Data<sqlx::PgPool>,
    id: web::Path<i32>
) -> Result<HttpResponse> {
    debug!("Attempting to delete todo with id: {}", id);
    
    match sqlx::query!(
        r#"
        DELETE FROM todo_items
        WHERE id = $1
        RETURNING id
        "#,
        id.into_inner()
    )
    .fetch_optional(pool.get_ref())
    .await {
        Ok(Some(_)) => {
            debug!("Successfully deleted todo with id: {}", id);
            Ok(HttpResponse::NoContent().finish())
        },
        Ok(None) => {
            error!("Todo with id {} not found", id);
            Ok(HttpResponse::NotFound().json(serde_json::json!({
                "error": "Todo not found"
            })))
        },
        Err(e) => {
            error!("Database error while deleting todo {}: {}", id, e);
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Failed to delete todo",
                "details": e.to_string()
            })))
        }
    }
}
