use std::sync::{Arc, Mutex};

use axum::{
    extract::State, response::{sse, Sse}, routing::{get, post}, Router
};
use ollama_rs::{error::OllamaError, generation::chat::{request::ChatMessageRequest, ChatMessage, MessageRole}, Ollama};
use futures::{Stream, StreamExt};
use serde::Serialize;
use tokio::sync::mpsc;
use tokio_stream::wrappers::UnboundedReceiverStream;

#[derive(Clone)]
struct AppState {
    ollama: Arc<Ollama>,
    chat_history: Arc<Mutex<Vec<ChatMessage>>>,
}

static MODEL_NAME: &str = "mistral:7b";

static SYSTEM_PROMPT: &str = r#"You are Alice a helpful assistant. Answer in a short more conversational style. You are in a chat with the user."#;

#[tokio::main]
async fn main() {
    // initialize the Ollama client
    let ollama = Ollama::new("http://ollama", 11434);
    let mut status_stream = ollama.pull_model_stream(MODEL_NAME.to_string(), false).await.unwrap();
    while let Some(event) = status_stream.next().await {
        println!("Model pull event: {:?}", event);
    }

    let state = AppState { 
        ollama: Arc::new(ollama),
        chat_history: Arc::new(Mutex::new(vec![
            ChatMessage::new(MessageRole::System, SYSTEM_PROMPT.to_string())
        ])),
    };

    // build our application with a single route
    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/api/chat", post(post_chat))
        .with_state(state);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[derive(Debug, Serialize)]
struct ChatEvent{
    chunk: String,
    done: bool,
}

async fn post_chat(State(state): State<AppState>, body: String) -> Sse<impl Stream<Item = Result<sse::Event, OllamaError>>> {
    let ollama = state.ollama.clone();
    let chat_history = state.chat_history.clone();

    let (tx, rx) = mpsc::unbounded_channel::<Result<ChatEvent,OllamaError>>();

    tokio::spawn(async move {
        let request = {
            let mut history = chat_history.lock().unwrap();
            history.push(ChatMessage::new(MessageRole::User, body.clone()));

            println!("Chat history: {:?}", history);

            ChatMessageRequest::new(MODEL_NAME.to_string(), history.clone())
        };

        let response = ollama.send_chat_messages_stream(request).await;
        let mut stream = match response {
            Ok(stream) => stream,
            Err(err) => {
                let _ = tx.send(Err(err));
                return;
            }
        };

        let mut full_response = String::new();

        while let Some(chat_res) = stream.next().await {
            if let Ok(chat_msg) = chat_res {
                let chat_event = ChatEvent {
                    chunk: chat_msg.message.content,
                    done: chat_msg.done,
                };
                full_response.push_str(&chat_event.chunk);
                let _ = tx.send(Ok(chat_event));
            }
        }
        {
            let mut history = chat_history.lock().unwrap();
            history.push(ChatMessage::new(MessageRole::Assistant, full_response));
        }
    });

    let event_stream = UnboundedReceiverStream::new(rx).map(|res| {
        res.map(|chat_event| {
            sse::Event::default().json_data(chat_event).unwrap()
        })
    });

    Sse::new(event_stream)
}
