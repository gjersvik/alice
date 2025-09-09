use axum::{
    debug_handler, extract::Path, http::StatusCode, response::IntoResponse, routing::{get, post}, Json, Router
};
use serde_json::json;
use thiserror::Error;
use tower_http::cors::CorsLayer;
use tracing::info;

#[derive(Error, Debug)]
enum ApiError {
    #[error("Workflow '{0}' not found")]
    WorkflowNotFound(String),
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let (status, error_message) = match &self {
            ApiError::WorkflowNotFound(name) => (StatusCode::NOT_FOUND, name.clone()),
            ApiError::Other(err) => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
        };
        let body = Json(json!({ "error": error_message }));
        (status, body).into_response()
    }
    
}

pub async fn start_server() -> anyhow::Result<()> {
    // build our application with a single route
    let app = Router::new().route("/", get(|| async { "Hello, World!" }))
        .route("/schedule/{workflow}", post(schedule))
        .layer(CorsLayer::permissive());

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;
    Ok(())
}

#[debug_handler]
async fn schedule(
    Path(workflow_name): Path<String>,
    Json(input): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, ApiError> {
    info!("Scheduling workflow '{}' with input: {}", workflow_name, input);
    if workflow_name == "chat" {
        Ok(Json(json!({
            "status": "completed",
            "workflow": workflow_name,
            "output": "There is no llm yet so have no idea what to say."
        })))
    } else {
        Err(ApiError::WorkflowNotFound(workflow_name))
    }
}
