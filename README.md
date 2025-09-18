# Alice
Alice is a personal Persistent AI Agent, with a team of role-based agents to assist you in your daily or working life.

## Getting started

Allice is still in early development and prototyping stage. So there is no production use yet. I use devcontiners so ither use the same or use it as guide to setup your own environment. Its setup to require Nvidia GPU for the Ollama model runner.

The backend is in rust and can be started with only `cargo run`. This will download dependencies, build and run the server. On the first run it will also download the llm model. It will take some time.

For the frontend you need to cd into the `frontend` folder and run `npm install` to get dependencies. After that you can run `npm run dev` to start the frontend.

For Alice to work you need both backend and frontend running. The backend will be on port 3000 and the frontend on port 5173.

This guide may be outdated, so check the roadmap for the latest status.

## Contributions

I am not looking for contributors or issues right now. Feel free to fork, but do not expect anything to run at this early stage.

Unless specified differently, all the code is under the MIT License. See [License](./LICENSE).