# Alice roadmap.

The main goal now is have an infinite chatlog. Using RAG or any other tech so that LLM seems like it has a infinte memory even if the moodel I plan to use Phi 4 have a limit of 16k tokens. 

## 1. The first chat.
Have simple frontend that can send chat messages to Ollama behind minimal backend.

 - [x] Setup a React + Equinor design system using Vite.
 - [x] Create a simple send chat UI that call fake data.
 - [x] Setup rust axum.
 - [x] Simple fake endpoint. 
 - [x] Have frontend talk to backend.
 - [x] Setup Ollama.
 - [x] Have backend use Ollama.
 - [x] Streem events to frontend.
 - [ ] ~~Force stop feature.~~ Ollama does not support it. Will chnage model runner later at some point.
 - [x] Update readme.

## 2. Presistance and peroalisation.
Turn the system into a full featured AI chat app. With multi chat histories saved.
* Etch user can have multiple Agents.
* Agents are isolated from each other.
* Etch Agent can have multiple chat histories.
* Both Agents and Chats have metadata.

So the path is /api/v1/agent/{agent_name}/chat/{chat_id}

 - [x] Have backend store chat in memory.
 - [x] Setup SurrealDB.
 - [x] Create schema for chat and agent in SurrealDB.
 - [ ] List agents endpoint and UI.
 - [ ] Create agent endpoint and UI.
 - [ ] Delete endpoint and UI.
 - [ ] List chats endpoint and UI.
 - [ ] Create chat endpoint and UI.
 - [ ] List messages endpoint and UI.
 - [ ] Chat with chat endpoint and UI.
 - [ ] Delete chat endpoint and UI.
 - [ ] Update readme.
 
## 3. Seatch and retrive. 
Have a system that allows the Agent to seatch in history and only collect the relevant facts. This turns chat into multi step workflow.
