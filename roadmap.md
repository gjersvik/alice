# Alice roadmap.

The main goal now is have an infinite chatlog. Using RAG or any other tech so that LLM seems like it has a infinte memory even if the moodel I plan to use Phi 4 have a limit of 16k tokens. 

## 1. The first chat.
Have simple frontend that can send chat messages to Ollama behind minimal backend.

 - [x] Setup a React + Equinor design system using Vite.
 - [x] Create a simple send chat UI that call fake data.
 - [x] Setup rust axum.
 - [ ] Simple fake endpoint. 
 - [ ] Have frontend talk to backend.
 - [ ] Setup Ollama.
 - [ ] Have backend use Ollama.
 - [ ] Streem events to frontend.
 - [ ] Force stop feature.
 - [ ] Update readme.


## 2. Presistance.
Have the backend store the chat in SurealDB.

## 3. Seatch and retrive. 
Have a system that allows the Agent to seatch in history and only collect the relevant facts.

