use axum::{
    routing::{get, post, delete},
    Router,
    http::StatusCode,
    extract::{Json, Path, State},
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, PgPool, Row};
use std::sync::Arc;
use tower_http::cors::{CorsLayer, Any};
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[derive(Debug, Serialize, Deserialize)]
struct Motivation {
    id: Option<i32>,
    content: String,
    author: Option<String>,
    tags: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateMotivation {
    content: String,
    author: Option<String>,
    tags: Option<Vec<String>>,
}

struct AppState {
    db: PgPool,
}

#[tokio::main]
async fn main() {
    // Load environment variables
    dotenv::dotenv().ok();
    
    // Database connection
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    // Create tables if they don't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS motivations (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            author TEXT,
            tags TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
    .execute(&pool)
    .await
    .expect("Failed to create table");

    let state = Arc::new(AppState { db: pool });

    // Build our application with a route
    let app = Router::new()
        .route("/api/motivations", get(get_motivations))
        .route("/api/motivations", post(create_motivation))
        .route("/api/motivations/:id", delete(delete_motivation))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        )
        .with_state(state);

    // Run our app with hyper
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("🚀 Server running on http://{}", addr);
    
    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_motivations(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Motivation>>, StatusCode> {
    let rows = sqlx::query(
        "SELECT id, content, author, tags FROM motivations ORDER BY created_at DESC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let motivations = rows
        .into_iter()
        .map(|row| Motivation {
            id: row.get("id"),
            content: row.get("content"),
            author: row.get("author"),
            tags: row.get("tags"),
        })
        .collect();

    Ok(Json(motivations))
}

async fn create_motivation(
    State(state): State<Arc<AppState>>,
    Json(motivation): Json<CreateMotivation>,
) -> Result<Json<Motivation>, StatusCode> {
    let row = sqlx::query(
        "INSERT INTO motivations (content, author, tags) VALUES ($1, $2, $3) RETURNING id, content, author, tags"
    )
    .bind(&motivation.content)
    .bind(&motivation.author)
    .bind(&motivation.tags)
    .fetch_one(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let motivation = Motivation {
        id: row.get("id"),
        content: row.get("content"),
        author: row.get("author"),
        tags: row.get("tags"),
    };

    Ok(Json(motivation))
}

async fn delete_motivation(
    State(state): State<Arc<AppState>>,
    Path(id): Path<i32>,
) -> Result<StatusCode, StatusCode> {
    sqlx::query("DELETE FROM motivations WHERE id = $1")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}
