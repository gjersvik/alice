import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/button/button.js';

import * as webllm from '@mlc-ai/web-llm';
import { CreateMLCEngine } from '@mlc-ai/web-llm';
import { Action, INITIAL_STATE, reducer, State } from './state';
import { ACTION_EVENT, StateComponent } from './components';

export default class App extends StateComponent {}
customElements.define('a-app', App);

const model = 'SmolLM2-360M-Instruct-q4f16_1-MLC';

async function main() {
    let state: State = INITIAL_STATE;

    const app = document.querySelector('a-app') as App;
    if (!app) {
        throw new Error('No a-app element found in the document.');
    }

    function dispatch(action: Action) {
        const commands = reducer(state, action);
        commands.forEach(cmd => {
            (async () => {
                for await (const nextAction of cmd()) {
                    dispatch(nextAction);
                }
            })();
        });
        app.render(state);
    }

    app.addEventListener(ACTION_EVENT, (event) => {
        const action = (event as CustomEvent<Action>).detail;
        dispatch(action);
    });
    
    // Initial render
    app.render(state);

    const list = document.getElementById('list');
    list?.addEventListener('click', e => {
        console.log(webllm.prebuiltAppConfig.model_list)
    })

    const load = document.getElementById('load');
    load?.addEventListener('click', async e => {
        let inCache = await webllm.hasModelInCache(model);
        console.log("Is SmolLM2-360M-Instruct-q4f16_1-MLC in cache?", inCache);

        const initProgressCallback = (progress) => {
            console.log("Model loading progress:", progress);
        };
        const engine = await CreateMLCEngine(model, { initProgressCallback });
        inCache = await webllm.hasModelInCache(model);
        console.log("Is SmolLM2-360M-Instruct-q4f16_1-MLC in cache?", inCache);
    })

    const unload = document.getElementById('unload');
    unload?.addEventListener('click', async e => {
        await webllm.deleteModelInCache(model)
        console.log(`Removed: ${model} i hope.`);
    })
}

main().catch( e => console.log("Main expesption:", e) );