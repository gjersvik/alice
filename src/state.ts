import * as loader from "./modules/loader";

export type State = {
    loader: loader.State;
};

export function initState(): [State, Command[]] {
    const [loaderState, loaderCommands] = loader.initState();
    return [{
        loader: loaderState
    }, loaderCommands];
}

export type Msg<N extends string, P = undefined> = P extends undefined
    ? { type: N }
    : { type: N; payload: P };

export type Action = {type: 'Loader', payload: loader.Action};

export function loaderAction(action: loader.Action): Action{
    return {
        type: 'Loader',
        payload: action
    }
}

export type Command = (dispatch: (Action) => Promise<void>) => void;

export function reducer(state: State, action: Action): Command[] {
    switch (action.type) {
        case 'Loader':
            return loader.reducer(state.loader, action.payload);
    }
}