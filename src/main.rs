use std::sync::Arc;

use axum::{
    extract::State, routing::{get, post}, Router
};
use ollama_rs::{generation::chat::{request::ChatMessageRequest, ChatMessage, MessageRole}, Ollama};

#[derive(Clone)]
struct AppState {
    ollama: Arc<Ollama>,
}

static MODEL_NAME: &str = "mistral:7b";

static SYSTEM_PROMPT: &str = r#"You are Alice a helpfull assistant. Awnser in a short more coversasinal style. You are in a chat with the user."#;

#[tokio::main]
async fn main() {
    // initialize the Ollama client
    let ollama = Ollama::new("http://ollama", 11434);
    let status = ollama.pull_model(MODEL_NAME.to_string(), false).await.unwrap();
    println!("Model pull status: {:?}", status);

    let state = AppState { ollama: Arc::new(ollama) };

    // build our application with a single route
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/api/chat", post(post_chat))
        .with_state(state);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn post_chat(State(state): State<AppState>, body: String) -> String {
    let ollama = state.ollama.as_ref();

    let request = ChatMessageRequest::new(MODEL_NAME.to_string(), vec![
        ChatMessage::new(MessageRole::System, SYSTEM_PROMPT.to_string()),
        ChatMessage::new(MessageRole::User, body),
    ]);

    let response = ollama.send_chat_messages(request).await;
    match response {
        Ok(res) => {
            res.message.content
        }
        Err(err) => {
            eprintln!("Error communicating with Ollama: {}", err);
            "Error communicating with the language model.".to_string()
        }
    }
}
