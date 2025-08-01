import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js';

import * as webllm from '@mlc-ai/web-llm';
import { Action, initState, reducer, State } from './state';
import { ACTION_EVENT, StateComponent } from './components';

export default class App extends StateComponent {}
customElements.define('a-app', App);

async function main() {
    let [state, commands] = initState();

    const app = document.querySelector('a-app') as App;
    if (!app) {
        throw new Error('No a-app element found in the document.');
    }

    let renderScheduled = false;
    function scheduleRender() {
        if (!renderScheduled) {
            renderScheduled = true;
            requestAnimationFrame(() => {
                app.render(state);
                renderScheduled = false;
            });
        }
    }

    function dispatch(action: Action) {
        const commands = reducer(state, action);
        commands.forEach(cmd => {
            cmd(dispatch)
        });
        scheduleRender();
    }

    commands.forEach(cmd => {
        cmd(dispatch);
    });

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
}

main().catch( e => console.log("Main expesption:", e) );