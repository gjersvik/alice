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
 - [ ] Streem events to frontend.
 - [ ] ~~Force stop feature.~~ Ollama does not support it. Will chnage model runner later at some point.
 - [ ] Update readme.

## 2. Presistance.
Have the backend store the chat in SurealDB.

 - [ ] Have backend store chat in memory.
 - [ ] Create endpoints so that frontend can get chat history.
 - [ ] Have the frontend use the server as source of truth.
 - [ ] Setup SurrealDB.
 - [ ] Design the schema for chat log.
 - [ ] Use in SurealDB to store chat.
 - [ ] Update readme.

## 3. Peroalisation.
The backend need to suport multiple Agents. I at least need to seperate beween development and daily driver. Shuld also be able to give the Agent a name and give it my name and not have it hardcoded as Alice. 

 - [ ] Add schema for Agent in SurrealDB.
 - [ ] Update current endpoint with agent name. Front and backend.
 - [ ] CRUD endpoints for Agent.
 - [ ] UI for creating and selecting Agent.
 - [ ] Update readme.

## 4. Seatch and retrive. 
Have a system that allows the Agent to seatch in history and only collect the relevant facts. This turns chat into multi step workflow.
