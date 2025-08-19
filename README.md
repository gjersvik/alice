# Alice
Alice is a personal Persistent AI Agent, with a team of role-based agents to assist you in your daily or working life.

## Vision
Alice aims to address a few problems I see with current AI agents on the market today.

### Persistent knowledge needs to work for humans and traditional software too.
There is a problem that occurs when you feed a statistical model like an LLM with its own output. It can get stuck on random patterns, and when that happens, it's very hard to get it out of that rut. The normal solution is just to start a new chat with fresh context. But this does not work when you want a system to remember and learn. To make this work, you need a human to be able to change what the AI knows, and have that be easy. Reading through months of chat logs is not going to work, and humans can't read vectors at all.

There is also a problem that the LLM can't keep secrets. Any information it may have access to has a non-zero chance of being used in any given reply. So a traditional software system needs to be able to keep track of what information is appropriate to give to an LLM at any given time. And the same problem again: software can't read chat logs or vectors.

My idea is that a Knowledge Graph can be a meeting point between LLMs, humans, and software.
 * The LLM can propose changes to the knowledge graph from chat logs and user input.
 * The human can read and edit the knowledge graph, from small corrections ("this relationship is wrong") to major changes ("forget everything about this project").
 * The software can maintain metadata and logically traverse relations, perform cleanup and maintenance, and limit the results based on its own context.

Knowledge graphs may not work. They may become just a giant mess of data. LLMs may not be able to use them. It may not be possible to model knowledge in a way software can reason about.

### Workflow Engine
The current trend is to empower LLMs to do tasks on their own, and combine that with humans' tendency to just allow all to get the job done now. We have giant security and safety issues on our hands. It's not so bad when each request is independent and stateless, and users need to add capabilities as needed. But when you want more persistent agents, and you want them to work on important stuff where failure is not an option.

My idea is to have the AI propose a solution that the user can review and edit, and then the solution is run in a workflow engine, where traditional software can make sure everything is right, properly logged, and auditable. So the LLM and humans can focus on what needs to be done, and the workflow engine can focus on how to do it.

Humans are generally better at seeing when something is wrong than at seeing what the possible future results may be. And I think this may just be a better way to handle security and safety.

One of the traditional issues with workflow engines is that they are flaky. If the world changes only a little bit, the workflow often fails, and humans have to maintain the workflows. If we allow the LLM the first pass at fixing the workflow, humans may just need a quick review. Also, this flakiness can be an asset. When a crisis happens, you want the AI agents to just stop and not do anything, instead of "intelligently" trying to fix the small task it sees and making the bigger issue worse.

The big risk here is that the LLMs will not be able to create sane workflows. Or that they will be too good and you get way too many workflows. So that the humans lose all control and oversight. There is a lot of balance here that will be impossible to see ahead of time.

### The final boss: UI automation.
Most services we use today either do not have an API, or the API is not designed for single users but for bigger apps. That means we need the system to click buttons and fill out forms. I am scared of this. I have some ideas but I am not convinced. There are machine and vision models that make it possible. But UI Automation makes workflows seem rock solid. Anytime they push a new version, that often happens daily, things change. Even if the UI looks the same, the div soup changes, and the system breaks.

I hope that good fundamentals with the self-healing workflow engine can really help here. Or it may even be a mostly solved problem by the time I get to it.

## Getting Started
I have a runbook I will try to keep up to date with the current state of the project.
See [Runbook](./runbook.md).

## High-Level Roadmap
### Find the Idea

The road from having an idea of an idea to actually having an idea is long and winding. So there will be many false starts and rewrites. And I need to learn a lot of new things about AI agents, agentic AI (yes, there is a difference), and how to work with LLMs and chat workflows. It's hard to know when this part is done and it's not just another false start.

At the end of this phase, I should have a persistent AI agent working with role-based agents, using the current best practices, without the features I think an AI agent needs.

### Proof of Concept
Try to implement the Knowledge Graph and the Workflow Engine as plugins to the running AI agent system I am having, to test out if the ideas work and what it will take to make them work.

By the end of this phase, I should have something that can scratch my own itch and do the things I want it to do. It may have four different UIs that are in no way built to work together, but it should be able to do the things I want it to do.

### Proof of Value
Now it's time to write the app for real. The goal is to have a common UI that works with the Knowledge Graph and the Workflow Engine. And most likely reimplement many of the tools and features that are prototyped, but now as a multi-user system, with a proper backend and a proper frontend.

It's very important that while we add features to the new system that they are compatible with or replace the old features, so that it's not a big bang rewrite, but a gradual migration to the new system.

Say that we start with the workflow engine. This new engine should replace the old one, with the glue-code necessary to keep the jank system working. This may require a full delete of the old workflows. That is fine. It only had one user anyway and he knew the risks.

## Contributions

I am not looking for contributors or issues right now. Feel free to fork, but do not expect anything to run at this early stage.

Unless specified differently, all the code is under the MIT License. See [License](./LICENSE).