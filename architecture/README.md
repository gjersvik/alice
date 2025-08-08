# Alice architecture discussion

This folder contains the architecture plans and vision for the Alice project. This is not how it is right now. Its main goal is to help us make decisions about Alice. This document is not set in stone. Sometimes we will need to make pragmatic decisions that will not follow the architecture. But they should have good reasons for it.

We should not write architecture documents for what is over the horizon. Only for what we can see and plan for. And only with the details we can reasonably infer at this time.

Also, architecture is a direction, not a target. So this document will change when the goals, focus, or technology changes.

## What is Alice? User perspective.
Alice is a personal AI agent that earns your trust by focusing on:

* The user is in control—this is YOUR assistant. Not a shareholder-owned one that pretends.
* Private by default. The data is yours. You decide where you want to go on the privacy vs convenience spectrum. And when. Not all your data is the same.
* Run it your way. In the browser, on your computer or private server. Or connect to a company backend. Or even from the shareholder-owned service.
* Transparent and understandable. You can see what is going on, why it is doing something, and how it works. No secrets.

## What is Alice? System perspective.
Alice is a data management, log processing, and configuration system that sometimes helps users.

Privacy, configurability and transparency are more core to the system than the LLM it connects to or runs. There will be no Config module or Privacy module or Log module. These are core concerns that permeate the entire system and its design and architecture.

Remember an overwhelmed, confused and scared user is not empowered. They are not in control. We are not earning their trust. We let users make informed choices (based on their level of understanding), where saying no is always a valid option.

## Technical architecture.
Alice has four main systems and 2 common services:

1. **AI Agent** - Your bog standard simplistic LLM powered AI agent.
2. **Knowledge Base** - GraphRAG, a knowledge base that stores what Alice knows.
3. **Workflow Engine** - The core system that manages any multi-step tasks and workflows.
4. **Integration Layer** - Connects the workflow engine to external actions and events.
5. **LLM Service** - A local or remote service that manages LLM access.
6. **Data Service** - SurrealDB or similar, allows the other systems to persist data.

Most of the code should not know if it's running in the browser or on a server. An agent is an atomic unit and should not share data with other agents. So the backend can just be a routing layer to the right isolated agent. The rest of the code can just focus on a single agent and its data.

### AI Agent.
The normal LLM agent features like adding, editing, and deleting messages and so on.
I am hesitant to make it too powerful, with MCP interactions. It's supposed to be subservient to the Workflow engine.

Requirements and wants:
- It should be more like a colleague than the normal question answering agent.
- Have a seemingly endless chatlog just as your colleagues on Slack or Teams.
- It should be possible to open up a message and see why this answer was given.
- The agent shuld be system aware and able to answer questions about itself.

### Knowledge Base.
The knowledge base is just as much for the user as it is for the LLM. So a big blob of vectors is not going to cut it.

We will start as a simple knowledge graph and full text search of backlog.
But the goal is to implement a full GraphRAG system.

Requirements and wants:
- The user should be able to see what Agent knows about them.
- The user should be able to edit and delete what Agent knows about them.
- The LLM should be able to access the knowledge base to answer questions.
- Should be able to learn from the chat log and files.

### Workflow Engine.
This is the core of Alice. And will mostly be split up into multiple modules. The workflow engine is responsible for:
- Store and run the user/agent created workflows.
- The internal workflows like generating chat, updating the knowledge base, and so on.
- Track all the logs and events that happen and map them to the workflows and tasks.
- Make sure metadata rules are followed and enforced.
- Store and enforce behavior rules for the agent and workflows.

Requirements and wants:
- Both the user and the agent should be able to create workflows.
- User must be able to review and edit workflows before they are run.
- Should be able, with LLM help, to propose fixes to broken workflows.

### Integration Layer.
Have not thought this through yet. But it should be able to connect to external services and events. And be able to trigger workflows based on these events.

### LLM Service.
This is the service that schedules and manages the LLM calls. That can be local or remote.

This is mainly a scheduling and management service. To make sure that the local or remote LLM is not overloaded.

### Data Service.
It's a database. Both the simplest and most complex part of the system. Even if it's not the database's job, we need to make sure that the data flow between browser and server is simple to sync.

- [Data Strategy](./data-strategy.md) - How we will handle data in Alice.

## Roadmap.
I can see three different futures for Alice that build on each other.

1. **Experimental**: I am just trying to scratch my own itch.
2. **Prototype at work**: Share with my team at work and have it as team assistant.
3. **It's out there**: Maybe, just maybe, it grows into a product that others can use.

### Experimental.
The main focus is just to get something working. Test out the ideas and see if they work. And be useful to me. I as the developer am already perfectly empowered and do not need any help with configuration or information about what is going on.

But it's important to keep the architecture in mind, so I do not paint myself into a corner. So that privacy, configuration, and transparency have a path to follow.

- [Dogfooding (Current)](./Dogfooding.md) - Implementing the minimum to make Alice useful to me as a developer.

### Prototype at work.
As the users will be highly technical individuals who are familiar with the developer, the configuration and transparency layers can be implemented, but do not sweat it. The focus is on making Alice useful to the team and helping them with their tasks.

But now is the time to add all the scaffolding and underlying patterns that will enable us to deliver on the architecture vision. This is the time to build the foundation for the future.

### It's out there.
Now we need to buckle down and focus on the core vision. We need to get the configuration and transparency right. That is way more important than adding new features. We need to make sure that the user is in control, can see what is going on, and can configure Alice to their liking.
