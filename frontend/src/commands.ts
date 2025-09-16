import { Dispatch, Msg } from "./state";

export namespace Cmd {
    export type SendChat = {
        type: 'sendChat',
        text: string,
        onReply: (reply: string) => Msg[]
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
        let response =  await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: cmd.text
        });
        let text = await response.text();

        let cmds = cmd.onReply(text);
        this.sendMsg(cmds);
    }

    private sendMsg(msg: Msg[]): void {
        msg.forEach(this.dispatch);
    }
}