import { Cmd } from "./commands";

export type Msg = 
    { type: 'sendChat'; text: string } |
    { type: 'receiveChat'; text: string }

export type Dispatch = (msg: Msg) => void;

export type State = {
   readonly chat: readonly ChatMessage[];
};

type ChatMessage = {
    readonly role: 'user' | 'assistant';
    readonly content: string;
};

export function init(): [State, Cmd.Any[]] {
    const state: State = {
        chat: [],
    };
    const cmds: Cmd.Any[] = [];
    return [state, cmds];
}

export function update(state: State, msg: Msg): [State, Cmd.Any[]] {
    switch (msg.type) {
        case 'sendChat': {
            const newMessage: ChatMessage = { role: 'user', content: msg.text };
            const newState: State = {
                ...state,
                chat: [...state.chat, newMessage],
            };
            const sendChat: Cmd.SendChat = { 
                type: 'sendChat',
                text: msg.text,
                onReply: (reply: string) => [{ type: 'receiveChat', text: reply }]
            };
            return [newState, [sendChat]];
        }
        case 'receiveChat': {
            const newMessage: ChatMessage = { role: 'assistant', content: msg.text };
            const newState: State = {
                ...state,
                chat: [...state.chat, newMessage],
            };
            return [newState, []];
        }
        default: {
            const _exhaustiveCheck: never = msg;
            return _exhaustiveCheck;
        }
    }
}