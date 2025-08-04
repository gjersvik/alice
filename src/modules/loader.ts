import * as main from "../state";
import { Msg } from "../state";

import { StateComponent } from "../components";
import WaDialog from "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import WaButton from "@awesome.me/webawesome/dist/components/button/button.js";
import WaProgressBar from "@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js";
import { Command } from "../command";

export type State = {
    loaded: boolean;
    loading: boolean;
    cached: boolean;
    progress: number; // 0-1 
    loadMessage: string;
}

export function initState(): State {
    return {
        loaded: false,
        loading: false,
        cached: false,
        progress: 0,
        loadMessage: ''
    }
}

export function initCommands(): Command[] {
    return [{
        type: "WebLLM_isInCache",
        complete: (running: boolean) => [modelInCache(running)]
    }]
}

export const INITIAL_STATE = {
    loaded: false,
    loading: false,
    cached: false,
    progress: 0,
    loadMessage: ''
}

export type Action = 
    Msg<'ModelInCache', boolean> |
    Msg<'LoadModel'> |
    Msg<'LoadEvent', {progress: number, text: string}> |
    Msg<'LoadDone'>;

function modelInCache(cached: boolean): main.Action {
    return main.loaderAction({ type: 'ModelInCache', payload: cached });
}

function loadModel(): main.Action {
    return main.loaderAction({ type: 'LoadModel' });
}

function loadEvent(progress: number, text: string): main.Action {
    return main.loaderAction({ type: 'LoadEvent', payload: { progress, text } });
}

function loadDone(): main.Action {
    return main.loaderAction({ type: 'LoadDone' });
}

export function reducer(state: State, action: Action): Command[] {
    switch (action.type) {
        case "ModelInCache":
            state.cached = action.payload;
            return [];
        case "LoadModel":
            return reduseLoadModel(state);
        case "LoadEvent":
            state.progress = action.payload.progress;
            state.loadMessage = action.payload.text;
            return [];
        case "LoadDone":
            state.loaded = true;
            return [];
    }
}

function reduseLoadModel(state: State): Command[] {
    state.loading = true;
    return [{
        type: "WebLLM_loadModel",
        onProgress: (progress) => [loadEvent(progress.progress, progress.text)],
        complete: () => [loadDone()]
    }]
}

class LoaderComponent extends StateComponent{
    private canClose: boolean = false;
    private running: boolean = false;
    private dialog: WaDialog | null = null;
    private loadButton: WaButton | null = null;
    private progressBar: WaProgressBar | null = null;
    private statusText: HTMLElement | null = null;

    connectedCallback(): void {
        super.connectedCallback();

        this.dialog = this.querySelector('wa-dialog');
        if (!this.dialog) {
            console.warn("LoaderComponent: No wa-dialog found in the component.");
            return;
        }

        this.dialog.addEventListener('wa-hide', e => {
            console.log("Dialog hide event triggered.");
            if (this.canClose === false) {
                e.preventDefault();
            }
        });

        this.progressBar = this.querySelector('[data-bar]');
        if (!this.progressBar) {
            console.warn("LoaderComponent: No progress bar found in the component.");
            return;
        }

        this.statusText = this.querySelector('[data-status]');
        if (!this.statusText) {
            console.warn("LoaderComponent: No status text element found in the component.");
            return;
        }

        this.loadButton = this.querySelector('[data-load]');
        if (!this.loadButton) {
            console.warn("LoaderComponent: No load button found in the component.");
            return;
        }

        this.loadButton.addEventListener('click', () => {
            if (this.running) {
                console.warn("LoaderComponent: Load operation is already running.");
                return;
            }
            this.dispatch(loadModel());
        });
    }

    render(state: main.State): void {
        let loaderState = state.loader;
        this.running = loaderState.loading;
        this.canClose = loaderState.loaded;

        this.loadButton!.disabled = this.running;
        this.loadButton!.textContent = loaderState.cached ? 
            "Load 2.5 Gig lanuage model" :
            "Download and Load 2.5 Gig lanuage model";
        
        this.progressBar!.value = loaderState.progress * 100;
        this.statusText!.textContent = loaderState.loadMessage;

        this.dialog!.open = !loaderState.loaded;

        this.renderChildren(state);
    }
}

customElements.define('a-loader', LoaderComponent);