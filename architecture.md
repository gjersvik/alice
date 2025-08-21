# Full Architecture

This my toughts on the architecture of Alice. In its full multi user mode. This is very early have not done much research yet. So this is more my current thoughts on the issue not a final design.

## The Workflow Engine
Alice may look like AI Agent. But its a workflow engine with some LLM actions. Almost everything in Alice is a workflow. User post a chat message, that is a workflow. New event from enviroment that tiggers a workflow. Needs to update the knowledge base, that is a workflow. So getting the workflow engine right is the most important part of Alice.

### The trick
You can make a simple workflow engine that have all the nice properties if you can acsept:
1. All workflows are pure. As in pure functions. They do the same thing every time they are run.
2. All actions are idempotent. As in they can be run multiple times without changing the result.
    * Minus call me later reply.

In this way you do not need to worry about state. You can just run every workflow from the start until it reaches the end or get a request to wait.

One can easly make a action idempotent by memoizing the result. As in saveing the result of the action. And then returning the saved result if the action is run again. This is a very simple way to make sure that the workflow engine can be restarted at any time without losing any data. Or running the same action multiple times.

#### The catch
When can an action delete its result? To garenty idempotenty you can never delete the result of an action. When ever you do that you can not garenty that the action will not be run again. So there need to be some way for the workflow engine to tell actions that a run is over for ever and will never be run again. This is the only way to make sure that the action can delete its result and not break idempotency.

### Types of workflows
There are three types of workflows in Alice.

#### System workflows
These are internal workflows that are used by Alice. They are defined in code and are not user editable. They are used to handle the internal logic of Alice, such as updating the knowledge base, handling chat messages, and so on. These workflows are run by the workflow engine and are not visible to the user.

#### User workflows
These are workflows defines by the user. With the help of the LLM. And is designed to be run multiple times. As events are triggered, or perioticaly. These workflows are used to handle tasks that the user wants to automate, such as sending emails, updating documents, and so on. The user can create, edit, and delete these workflows.

#### Agent workflows
These are workflows that are created by the LLM. They are designed solve a specific problem or task. They are designed to only be run once. After the user have reviewed and approved them.

### The context
The workflow maintain a context for etch run. For eveyting that the workflow itself is not allowd to know or chnage. This is manly used for autorization and security. The context flow into eatch action and is used to determine what the action is allowed to do. The context is also used to store metadata about the workflow run, such as the user who started the workflow, the time it was started, and so on.

### The log.
The workflow engine maintains a detailed log of all actions that are run. This log is used to debug workflows and to track what has happened in the system. The log is also used to provide a history of the workflow runs, so that the user can see what has happened in the past.

### In summary
The workflow engine maintains metadata and the log. And retry workflows that needs to wait. Its the actions job maintain idempotentsy and securety.