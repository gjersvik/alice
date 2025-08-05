# The road to dogfooding.

The first goal is get Alice to a point where I want to use it myself. For that i think it needs to be able to learn from my conversations. Then it can do someting that Github Copilot and Preplexesty can't do for me. 

So the plan is to B-line to that feature and only implement creature comforts that actively annoy me while developing it. And to stop me from boiling the ocean, I will do that in stages.

After each stage I will have small refactoring and cleanup. To make things consistent even if that is consistently bad.

## Stage 1: Chat with LLM (Done)
**Goal:** Just get a simple chat ui talking to an LLM. Running somewhere, preferably in the browser.

**Focus:** is to setup the basic architecture and development environment. And learn how to use and run a LLM in the browser. Get the scaffolding with a UI and service layer that can be used to build on top of.

**Capability:** having an LLM in the browser. The most central part of an AI assistant.

## Stage 2: Prompt testing tool.
**Goal:** Allow me to edit, save, and duplicate chat history. So that I can use that to develop the prompts i will need for more complex chat interactions.

**Focus:** here is the database SurealDB. Get the it up and running in the browser. And wire it up to the UI layer. Store and retrieve chat history.

This will bring in the capability of database storage and retrieval. No point in learning without a place to store it.

## Stage 3: Full-text search retrieval.
**Goal:** Add context to chat prompts from chat history. So that i can tell the agent things to remember and learn from.

The main focus is learning about complex multistep prompts. And how to use the LLM to extract keywords and summarize text. And build the first little hint of a workflow engine.

**Capability:** running multiple steps of prompts with context to build up a reply.

## Stage 4: Play with knowledge extraction.
**Goal:** Find a good way to extract knowledge from chat history. In a way that i can easily put in the database.

**Focus:** My guess is that just asking the LLM to summarize the chat history into a graph will not work. So i will need to experiment with different ways to extract knowledge from the chat history. And how to store it in SurealDB.

**Capability:** The ability to extract knowledge from chat history and other documents. And store it in a way that can be used to answer questions.

## Stage 5: Context from knowledge graph.
**Goal:** Put it all together in a simple chat UI. Where the user can ask questions and the AI will use previous knowledge to answer it.

**Focus:** Make all the pieces work together. With a minimal of effort. This is not about making it pretty or easy to use. Just make it work. A starting to make a useful AI assistant.

**Capability:** An AI assistant that i can start to teach what is important to me. That can retrieve useful knowledge from the chat history and other documents.