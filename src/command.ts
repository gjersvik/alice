import Channel from "./channel";
import { Action } from "./state"
import WebLLM, { ProcessReport } from "./services/webllm";

export type Command = 
    {
        "type": "WebLLM_isInCache"
        complete: (running: boolean) => Action[];
    } | {
        "type": "WebLLM_loadModel"
        onProgress: (progress: ProcessReport) => Action[];
        complete: () => Action[];
    }

export default class Commander{
    private backendChannel: Channel<Action>;

    constructor(backendChannel: Channel<Action>) {
        this.backendChannel = backendChannel;

        // Start servcies by getting instances
        WebLLM.getInstance().catch(err => {
            console.error("Failed to initialize WebLLM service:", err);
        });
    }

    run(commands: Command[]): void {
        commands.forEach(command => {
            this.runCommand(command).catch(err => {
                console.error("Error running command:", err);
            });
        });
    }

    async webLlmIsInCache(comand: {complete: (running: boolean) => Action[]}): Promise<void> {
        const webllm = await WebLLM.getInstance();
        const cached = await webllm.inCache();
        this.sendActions(comand.complete(cached));
    }

    async webLlmLoadModel(command: {onProgress: (progress: ProcessReport) => Action[], complete: () => Action[]}): Promise<void> {
        const webllm = await WebLLM.getInstance();
        await webllm.load(progress => {
            this.sendActions(command.onProgress(progress));
        });
        this.sendActions(command.complete());
    }

    async runCommand(command: Command): Promise<void> {
        switch (command.type) {
            case "WebLLM_isInCache":
                await this.webLlmIsInCache(command);
                return;
            case "WebLLM_loadModel":
                await this.webLlmLoadModel(command);
                return;
        }
    }

    private async sendActions(actions: Action[]): Promise<void> {
        for (const action of actions) {
            await this.backendChannel.send(action);
        }
    }
}






