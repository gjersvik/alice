# Runbook

While we are in the "find the idea" phase, the main entry point is the docker-compose file. This will start all the tools I have found to do all the bits and bobs. I will try to keep configuration in Dockerfiles, so the system can be started with a single command. But I really will see how that goes.

## Get the system up and running

I will just assume you have Docker up and running with GPU support. The code assumes you have an Nvidia GPU. Sorry, but both my home and work computers have Nvidia GPUs. And right now the system just needs to run on my computer.

* Run `docker compose up` in the root of the project.
* Open your browser and go to `http://localhost:8080/` for the Open WebUI.
* Create an admin user.
* Download some LLM models. The models I have running are:
    * `llama3.1:8b` - The main model I plan to test with.
    * `marksverdhei/normistral-it:7b` - A Norwegian model. You know, for Norwegian stuff.
    * `phi3:mini` - Tiny model for when you only care that the pipeline works, not the results.
* You download models from the admin settings page.

## Tools used and links to documentation
* [Open WebUI](https://docs.openwebui.com/)
* [Ollama](https://github.com/ollama/ollama/tree/main/docs)