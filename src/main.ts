import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js';

import * as webllm from '@mlc-ai/web-llm';
import { Action, initCommands, initState, reducer } from './state';
import { ACTION_EVENT, StateComponent } from './components';
import Channel from './channel';
import Commander from './command';


export default class App extends StateComponent {}
customElements.define('a-app', App);

async function main() {
    let uiChannel = new Channel<Action>();
    let backendChannel = new Channel<Action>(16);

    const commander = new Commander(backendChannel);
    commander.run(initCommands());

    const app = document.querySelector('a-app') as App;
    if (!app) {
        throw new Error('No a-app element found in the document.');
    }

    app.addEventListener(ACTION_EVENT, (e) => {
        const action = (e as CustomEvent<Action>).detail;
        uiChannel.trySend(action);
    });

    let state = initState();
    app.render(state);

    const list = document.getElementById('list');
    list?.addEventListener('click', e => {
        console.log(webllm.prebuiltAppConfig.model_list)
    })

    while (true) {
        // Wait for next action
        await Promise.race([
            uiChannel.wait(),
            backendChannel.wait()
        ]);

        // Wait for animation frame to ensure UI updates
        await new Promise(resolve => requestAnimationFrame(resolve));

        let actionCount = 0;
        let action: Action | undefined;

        // Process actions from the UI channel
        while ((action = uiChannel.tryRecv())) {
            commander.run(reducer(state, action));
            actionCount++;
        }

        if (actionCount > 4) {
            console.warn(`Strange: ${actionCount} ui actions received in a single frame. This might indicate a performance issue or a bug.`);
        }

        // While we have proccessed less than 16 actions, we can process backend actions
        while (actionCount < 16 && (action = backendChannel.tryRecv())) {
            commander.run(reducer(state, action));
            actionCount++;
        }

        // Render the updated state
        app.render(state);
    }
}

main().catch( e => console.log("Main exception:", e) );