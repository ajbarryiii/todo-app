use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;
use crate::db::todo_db::{add_todo_item, get_all_items};
use crate::handlers::todo::{get_todos,create_todo ,delete_todo, update_todo};
use crate::models::todo_item::{ToDoItem, RecurringType};
use sqlx::PgPool;

#[derive(Deserialize)]
struct NewToDoItem {
    item_name: String,
    task_category: String,
    recurring_type: Option<RecurringType>,  // Accept the complex RecurringType
    done: bool,
}

// Handler for creating a new to-do item
async fn create_todo_item(
    pool: web::Data<PgPool>,
    new_item: web::Json<NewToDoItem>,
) -> impl Responder {
    let todo_item = ToDoItem {
        id: 0,  // Placeholder, will be set by the database
        item_name: new_item.item_name.clone(),
        due_date: None,
        task_category: new_item.task_category.clone(),
        recurring_type: new_item.recurring_type.clone(),  // Recurring type logic is now applied
        done: new_item.done,
    };

    match add_todo_item(pool.get_ref(), &todo_item).await {
        Ok(inserted_item) => HttpResponse::Ok().json(inserted_item),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

// Handler for listing all to-do items
async fn list_todo_items(
    pool: web::Data<PgPool>,
) -> impl Responder {
    match get_all_items(pool.get_ref()).await {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

// Register routes for to-do list actions
pub fn todo_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/todos")
            .route(web::post().to(create_todo_item))
            .route(web::get().to(list_todo_items)),
    );
    cfg.service(get_todos)
        .service(create_todo)
        .service(delete_todo)
        .service(update_todo);
}
