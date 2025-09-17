import { ChatEvent, Cmd } from "./commands";

export type Msg = 
    { type: 'sendChat'; text: string } |
    { type: 'receiveChunk'; text: string }

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
            const newReply: ChatMessage = { role: 'assistant', content: '' };
            const newState: State = {
                ...state,
                chat: [...state.chat, newMessage, newReply],
            };
            const sendChat: Cmd.SendChat = { 
                type: 'sendChat',
                text: msg.text,
                onChunk: (event: ChatEvent) => [{ type: 'receiveChunk', text: event.chunk }]
            };
            return [newState, [sendChat]];
        }
        case 'receiveChunk': {
            const chat = [...state.chat];
            const lastIndex = chat.length - 1;
            if (lastIndex >= 0 && chat[lastIndex].role === 'assistant') {
                const lastMessage = chat[lastIndex];
                const updatedMessage: ChatMessage = {
                    ...lastMessage,
                    content: lastMessage.content + msg.text,
                };
                chat[lastIndex] = updatedMessage;
            }
            const newState: State = {
                ...state,
                chat: chat,
            };
            return [newState, []];
        }
        default: {
            const _exhaustiveCheck: never = msg;
            return _exhaustiveCheck;
        }
    }
}