import { Dispatch, Msg } from "./state";
import { SSEvent, SSE } from "sse.js";

export type ChatEvent = {
    chunk: string,
    done: boolean,
}

export namespace Cmd {
    export type SendChat = {
        type: 'sendChat',
        text: string,
        onChunk: (reply: ChatEvent) => Msg[]
    }

    export type Any = SendChat;
}

export default class Commander {
    constructor(private dispatch: Dispatch) {}

    public runAll(cmds: Cmd.Any[]): void {
        for (const cmd of cmds) {
            (async () => {
                await this.sendChat(cmd);
            })().catch(console.error);
        }
    }

    private async sendChat(cmd: Cmd.SendChat): Promise<void> {
        let source = new SSE('/api/chat', {
            headers: {
                'Content-Type': 'text/plain'
            },
            payload: cmd.text
        });
        source.onmessage = (e: SSEvent ) => {
            let data: ChatEvent = JSON.parse(e.data);
            let msgs = cmd.onChunk(data);
            this.sendMsg(msgs);
        }
    }

    private sendMsg(msg: Msg[]): void {
        msg.forEach(this.dispatch);
    }
}