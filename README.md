# Alice
Personal AI assistant that learns from you and helps you.

## Getting Started

This is currently a frontend-only app using Vite. Run it with:
`npm install` and `npm run dev`

## Current Status
Not even an idea—more like the idea of an idea.

## Vision
Alice is a personal AI assistant that remembers and learns from you. It can do tasks for you, but you are in control.

### Local First, Private First
You can run Alice completely in the browser without any backend. It starts out as private as possible. You make an active choice to trade privacy for convenience by connecting to backends and integrations.

- You can run in the browser only.
- You can host the backend yourself.
- You can use a hosted solution in full or in part.

### The AI Can Only Propose
The AI has no access or ability to do anything directly. It can only propose solutions that you can accept, edit, or reject. The solution is then run in a workflow engine that has no "intelligence."

### Nothing Up My Sleeve
You can see and edit what the AI knows. If you get a weird result, you can review every step of your reply, all the system prompts, user prompt and data.

## Architecture

### AI Runtime
Built on top of an LLM. Has short-term memory in the form of full-text search over recent chat logs, and long-term understanding in the form of a knowledge graph.

When a user sends a prompt, the runtime will roughly follow this high-level pipeline:
1. Use the LLM to extract keywords from the user prompt for both full-text and knowledge graph search.
2. Run database queries on both the chat log and knowledge graph to find the most relevant results.
3. Use the LLM to summarize and rewrite the database results into text.
4. Add the text as more context and create the full prompt to give to the chat LLM.
5. Save the user prompt and chat reply in the chat log.

Occasionally, either triggered by the user or automatically, the AI will "go to sleep" and turn the chat log and other user-added context into understanding. This process roughly follows these steps:
1. Find out what context can be disregarded, using database queries and LLM assistance.
2. Summarize the remaining data using the LLM.
3. Identify the main knowledge entities in the text.
4. Have the LLM compare what it knows with the text and propose changes.
5. Apply the changes in a way that is easy to revert.

### Workflow Engine
When the assistant needs to affect the real world, it will do so using an "If This Then That" workflow. How this will work in practice is still a bit fuzzy, but here are the main requirements:

* Needs to be able to be retried without side effects.
* It should be easy for an LLM to generate new workflows.
* It must be easy for a human to create, edit, and review workflows.
* It must be easy to add new events and actions to the engine (plugins).

## Contributions

I am not looking for contributors or issues right now. Feel free to fork, but do not expect anything to run at this early stage.

Unless specified differently, all the code is under the MIT License. See [License](./LICENSE).