import { Command } from "./command";

export type State = {
    loader: Loader;
    chat_log: ChatMessage[];
    chat_stream: string;
    chat_input: string;
};

export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export type Loader = {
    loaded: boolean;
    loading: boolean;
    cached: boolean;
    progress: number; // 0-1 
    loadMessage: string;
}

export function initState(): State {
    return {
        loader: {
            loaded: false,
            loading: false,
            cached: false,
            progress: 0,
            loadMessage: ''
        },
        chat_log: [{
            role: 'system',
            content: 'You are a helpful assistant. Please answer the user\'s questions to the best of your ability. Reply using markdown.'
        }],
        chat_stream: '',
        chat_input: ''
    };
}


export function initCommands(): Command[] {
    return [{
        type: "WebLlmIsInCache",
        complete: (running: boolean) => [{ type: 'ModelInCache', inCache: running }]
    }]
}

export type Action = 
    {type: 'UserWrite', text: string} |
    {type: 'UserSend'} |
    {type: 'AiStream', chunk: string} |
    {type: 'AiMessage', message: string} |
    {type: 'ModelInCache', inCache: boolean} |
    {type: 'LoadModel'} |
    {type: 'LoadEvent', progress: number, text: string} |
    {type: 'LoadDone'};

export function reducer(state: Readonly<State>, action: Action): [State,Command[]] {
    switch (action.type) {
        case 'UserWrite':
            return [{
                ...state,
                chat_input: action.text,
            }, []];
        case 'UserSend':
            if (state.chat_input.trim() === '') {
                return [state, []];
            }
            let newState: State = {
                ...state,
                chat_log: [...state.chat_log, { role: 'user', content: state.chat_input }],
                chat_input: '',
                chat_stream: ''
            };
            // Dispatch command to start AI response
            return [newState, [{ type: 'WebLlmChatCompletion', 
                messagges: newState.chat_log, 
                chunk: (message: string) => [{ type: 'AiStream', chunk: message }], 
                complete: (message: string) => [{ type: 'AiMessage', message }]
            }]];
        case 'AiStream':
            return [{
                ...state,
                chat_stream: state.chat_stream + action.chunk
            }, []];
        case 'AiMessage':
            return [{
                ...state,
                chat_log: [...state.chat_log, { role: 'assistant', content: action.message }],
                chat_stream: ''
            }, []];
        case "ModelInCache":
            return [{
                ...state,
                loader: {
                    ...state.loader,
                    cached: action.inCache
                }
            }, []];
        case "LoadModel":
            return reduseLoadModel(state);
        case "LoadEvent":
            return [{
                ...state,
                loader: {
                    ...state.loader,
                    progress: action.progress,
                    loadMessage: action.text
                }
            }, []];
        case "LoadDone":
            return [{
                ...state,
                loader: {
                    ...state.loader,
                    loaded: true
                }
            }, []];
        default:
            const exhaustiveCheck: never = action;
            throw new Error(`Unhandled action type: ${exhaustiveCheck}`);
    }
}

function reduseLoadModel(state: State): [State, Command[]] {
    return [{
        ...state,
        loader: {
            ...state.loader,
            loading: true,
            progress: 0,
            loadMessage: 'Loading model...'
        }
    }, [{
        type: "WebLlmLoadModel",
        onProgress: (progress) => [{ type: 'LoadEvent', progress: progress.progress, text: progress.text }],
        complete: () => [{ type: 'LoadDone' }]
    }]];
}