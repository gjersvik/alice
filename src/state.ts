import { Command } from "./command";
import * as loader from "./modules/loader";

export type State = {
    loader: loader.State;
    chat_log: ChatMessage[];
    chat_stream: string;
    chat_input: string;
};

export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export function initState(): State {
    return {
        loader: loader.initState(),
        chat_log: [{
            role: 'system',
            content: 'You are a helpful assistant. Please answer the user\'s questions to the best of your ability. Reply using markdown.'
        }],
        chat_stream: '',
        chat_input: ''
    };
}

export function initCommands(): Command[] {
    return loader.initCommands();
}

// Deprecated: Just use objects with type string and wathever.
export type Msg<N extends string, P = undefined> = P extends undefined
    ? { type: N }
    : { type: N; payload: P };

export type Action = 
    {type: 'Loader', payload: loader.Action} |
    {type: 'UserWrite', text: string} |
    {type: 'UserSend'} |
    {type: 'AiStream', chunk: string} |
    {type: 'AiMessage', message: string};

export function loaderAction(action: loader.Action): Action{
    return {
        type: 'Loader',
        payload: action
    }
}

export function reducer(state: State, action: Action): Command[] {
    switch (action.type) {
        case 'Loader':
            return loader.reducer(state.loader, action.payload);
        case 'UserWrite':
            state.chat_input = action.text;
            return [];
        case 'UserSend':
            if (state.chat_input.trim() === '') {
                return [];
            }
            state.chat_log.push({ role: 'user', content: state.chat_input });
            state.chat_input = '';
            state.chat_stream = '';
            return [{
                type: 'WebLlmChatCompletion',
                messagges: state.chat_log,
                chunk: (message: string) => [{ type: 'AiStream', chunk: message }],
                complete: (message: string) => [{ type: 'AiMessage', message }]
            }];
        case 'AiStream':
            state.chat_stream += action.chunk;
            return [];
        case 'AiMessage':
            state.chat_log.push({ role: 'assistant', content: action.message });
            state.chat_stream = '';
            return [];
    }
}