import * as loader from "./modules/loader";

export type State = {
    loader: loader.State;
};

export const INITIAL_STATE: State = {
    loader: loader.INITIAL_STATE
};

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

export type Command = () => AsyncIterable<Action>;

export function reducer(state: State, action: Action): Command[] {
    switch (action.type) {
        case 'Loader':
            return loader.reducer(state.loader, action.payload);
    }
}