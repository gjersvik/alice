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
        let cmds = cmd.onReply("There is no LLM yet so don't know what ti say to that.");
        this.sendMsg(cmds);
    }

    private sendMsg(msg: Msg[]): void {
        msg.forEach(this.dispatch);
    }
}