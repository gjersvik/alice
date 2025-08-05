import Channel from "./channel";
import { Action } from "./state"
import WebLLM, { ProcessReport } from "./services/webllm";

export type WebLLMisInCacheCommand = {
    type: "WebLLM_isInCache";
    complete: (running: boolean) => Action[];
};

export type WebLLMLoadModelCommand = {
    type: "WebLLM_loadModel";
    onProgress: (progress: ProcessReport) => Action[];
    complete: () => Action[];
};

export type WebLlmChatCompletionCommand = {
    type: "WebLlmChatCompletion";
    messagges: {
        role: "user" | "assistant" | "system";
        content: string;
    }[];
    chunk: (message: string) => Action[];
    complete: (message: string) => Action[];
};

export type Command = 
    WebLLMisInCacheCommand | 
    WebLLMLoadModelCommand |
    WebLlmChatCompletionCommand;

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

    async webLlmIsInCache(command: WebLLMisInCacheCommand): Promise<void> {
        const webllm = await WebLLM.getInstance();
        const cached = await webllm.inCache();
        this.sendActions(command.complete(cached));
    }

    async webLlmLoadModel(command: WebLLMLoadModelCommand): Promise<void> {
        const webllm = await WebLLM.getInstance();
        await webllm.load(progress => {
            this.sendActions(command.onProgress(progress));
        });
        this.sendActions(command.complete());
    }

    async webLlmChatCompletion(command: WebLlmChatCompletionCommand): Promise<void> {
        const webllm = await WebLLM.getInstance();
        const result = await webllm.chatCompletion(
            command.messagges,
            onChunk => {
                this.sendActions(command.chunk(onChunk));
            });
        this.sendActions(command.complete(result));
    }

    async runCommand(command: Command): Promise<void> {
        switch (command.type) {
            case "WebLLM_isInCache":
                await this.webLlmIsInCache(command);
                return;
            case "WebLLM_loadModel":
                await this.webLlmLoadModel(command);
                return;
            case "WebLlmChatCompletion": {
                await this.webLlmChatCompletion(command);
                return;
            }
            default:
                const exhaustiveCheck: never = command;
                console.error("Unhandled command type:", exhaustiveCheck);
        }
    }

    private async sendActions(actions: Action[]): Promise<void> {
        for (const action of actions) {
            await this.backendChannel.send(action);
        }
    }
}






