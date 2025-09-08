# Roadmap a new start.

I want to get back to coding, with a focus on fun and learning. I will clean up repo for a more focused project. 

## 1. A new aretcture
I want to move to a TypeScript/React frontend and a Rust backend. That implment a workflow engine. So I will remove WebLLM and use Ollama behind a Rust backend.

- [x] Add rust and Ollama to the dev container.
- [x] Init a new Rust project with axum. 
- [ ] Build a minimal workflow engine that only know the chat workflow.
  - [ ] Define a dummy workflow endpoint.
  - [ ] Create a dummy workflow engine that returns a hardcoded response. Use that for the endpoint.
  - [ ] Create a dummy chat workflow/step that returns a hardcoded response. Use that for the workflow engine.
  - [ ] Create a dummy Ollama action that returns a hardcoded response. Use that for the chat step.
  - [ ] Implement action to call the real Ollama API. 
- [ ] Update the ui to use the new chat workflow.

## 2. Clean up the repo
After the new architecture there is 3-4 different versions of alice in the repo. I will clean up the repo so there is only one.

- [ ] Update the README to reflect the new architecture.
- [ ] Remove the docker-compose and dockerfiles.
- [ ] Consolidate into one architecture documentation.
- [ ] Create a clean new project sturture.
- [ ] One last README pass with a simple get started guide.

