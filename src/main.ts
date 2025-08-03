import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js';

import * as webllm from '@mlc-ai/web-llm';
import { Action, initState, reducer, State } from './state';
import { ACTION_EVENT, StateComponent } from './components';
import { Chan } from 'ts-chan';

export default class App extends StateComponent {}
customElements.define('a-app', App);

async function main() {
    let [state, commands] = initState();

    let msgChannel = new Chan<Action>(32);

    const app = document.querySelector('a-app') as App;
    if (!app) {
        throw new Error('No a-app element found in the document.');
    }

    function dispatch(action: Action) {
        if (msgChannel.trySend(action) === false) {
            console.warn("Message channel is full, awaiting action dispatch");
            msgChannel.send(action);
        }
    }

    commands.forEach(cmd => {
        cmd(dispatch);
    });

    app.render(state);

    const list = document.getElementById('list');
    list?.addEventListener('click', e => {
        console.log(webllm.prebuiltAppConfig.model_list)
    })

    while (true) {
        // Wait for next action
        let action: Action | undefined = (await msgChannel.recv()).value;

        // Wait for animation frame to ensure UI updates
        await new Promise(resolve => requestAnimationFrame(resolve));

        // Drain the message channel before rendering
        while (action) {
            // Process the action
            const commands = reducer(state, action);
            commands.forEach(cmd => {
                cmd(dispatch);
            });

            action = msgChannel.tryRecv()?.value;
        }

        // Render the updated state
        app.render(state);
    }
}

main().catch( e => console.log("Main exception:", e) );