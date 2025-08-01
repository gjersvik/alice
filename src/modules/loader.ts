import * as main from "../state";
import { Msg, Command } from "../state";

import * as webllm from "../services/webllm";

export type State = {
    loaded: boolean;
    cached: boolean;
    progress: number; // 0-1 
    loadMessage: string;
}

export const INITIAL_STATE = {
    loaded: false,
    cached: false,
    progress: 0,
    loadMessage: ''
}

export type Action = 
    Msg<'CheckCache'> |
    Msg<'ModelInCache', boolean> |
    Msg<'LoadModel'> |
    Msg<'LoadEvent', {progress: number, text: string}> |
    Msg<'LoadDone'>;

export function checkCache(): main.Action {
    return main.loaderAction({ type: 'CheckCache' });
}

export function modelInCache(cached: boolean): main.Action {
    return main.loaderAction({ type: 'ModelInCache', payload: cached });
}

export function loadModel(): main.Action {
    return main.loaderAction({ type: 'LoadModel' });
}

export function loadEvent(progress: number, text: string): main.Action {
    return main.loaderAction({ type: 'LoadEvent', payload: { progress, text } });
}

export function loadDone(): main.Action {
    return main.loaderAction({ type: 'LoadDone' });
}

export function reducer(state: State, action: Action): Command[] {
    switch (action.type) {
        case 'CheckCache':
            return [async function* () {
                for await (const cached of webllm.inCache()) {
                    yield modelInCache(cached);
                }
                yield loadDone();
            }];
        case "ModelInCache":
            state.cached = action.payload;
            return [];
        case "LoadModel":
            return [async function* () {
                for await (const progress of webllm.load()) {
                    yield loadEvent(progress.progress, progress.text ?? "");
                }
                yield loadDone();
            }];
        case "LoadEvent":
            state.progress = action.payload.progress;
            state.loadMessage = action.payload.text;
            return [];
        case "LoadDone":
            state.loaded = true;
            return [];
    }
}

