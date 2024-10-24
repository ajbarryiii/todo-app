use actix_cors::Cors;
use actix_web::{App, HttpServer, web, middleware::Logger};
use sqlx::PgPool;
use dotenv::dotenv;
use std::env;

mod api;
mod db;
mod models;

// Function to configure the database
async fn configure_database() -> Result<PgPool, sqlx::Error> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let pool = PgPool::connect(&database_url).await?;

    // Test the connection
    sqlx::query("SELECT 1")
        .fetch_one(&pool)
        .await?;

    println!("Successfully connected to database");
    Ok(pool)
}

// Function to configure CORS
fn configure_cors() -> Cors {
    let frontend_url = env::var("FRONTEND_URL")
        .unwrap_or_else(|_| String::from("http://localhost:5173"));

    println!("Configuring CORS for frontend URL: {}", frontend_url);

    Cors::default()
        .allowed_origin(&frontend_url)
        .allowed_origin("http://localhost:3000")  // Alternative frontend URL
        .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
        .allowed_headers(vec!["Content-Type", "Authorization"])
        .supports_credentials()
        .max_age(3600)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables
    dotenv().ok();

    // Initialize logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // Get port from environment or use default
    let port = env::var("PORT").unwrap_or_else(|_| String::from("8080"));
    let addr = format!("0.0.0.0:{}", port);

    // Set up database connection pool
    let pool = configure_database()
        .await
        .expect("Failed to configure database");

    log::info!("Starting server at {}", addr);

    // Start HTTP server
    HttpServer::new(move || {
        App::new()
            .wrap(configure_cors())  // Add CORS middleware
            .wrap(Logger::default()) // Add logging middleware
            .app_data(web::Data::new(pool.clone()))
            .service(
                web::scope("/api")  // Add /api prefix to all routes
                    .configure(api::todo_routes::todo_routes)
            )
    })
    .bind(&addr)?
    .run()
    .await
}
