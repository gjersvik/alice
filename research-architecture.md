# Research Architecture

Architecture for version of Alice that exists to validate the ideas and concepts.

## First version uses existing tech.
First goal is to get a Persisted AI Agent up and running, using the current happy path, even if I disagree with her solution and trade-offs.

Ollama + Open WebUI for chat UI.
Ollama + Flowise for agents and RAG.
Ollama + n8n for workflow automation.

Write the minimal glue code to get an Alice-like flow.

## Use knowledge graph.
Find a knowledge graph or graph database with a nice GUI.

Write quick and dirty plugins for Flowise. Then experiment with both analysis flow and chat flow in Flowise.

The main goal is to get a feel for how a knowledge graph and LLM work together, and look for refinements to solve the big issues that come up. I should have a mostly working version, and there should be no issues that are dealbreakers other than hints that the approach is flawed and will never work.

Flowise is not a production-ready agent runtime and will be hard to deploy in prod. But it does not need that to test the LLM / Knowledge graph loop.

## LLM generated workflows.
The main thing I want to test out is if LLM can generate simple workflows. Very practical ones. Send email to x with title y and body z. I am not looking for big complicated workflows but that would also be nice.

n8n is a horrible workflow engine. It has very little error recovery and replayability. But I do not need that to test out if my idea of Agent generated workflows works.

I may need to use a simpler data format than n8n; in that case I will have to write a translator. It should be quick and dirty—the main goal is to test how much help and handholding the LLM needs to generate working workflows from a problem.
