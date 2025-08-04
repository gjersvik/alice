import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js';

import * as webllm from '@mlc-ai/web-llm';
import { Action, Command, initState, reducer, State } from './state';
import { ACTION_EVENT, StateComponent } from './components';
import Channel from './channel';


export default class App extends StateComponent {}
customElements.define('a-app', App);

async function main() {
    let [state, commands] = initState();

    let uiChannel = new Channel<Action>();
    let backendChannel = new Channel<Action>(16);

    const dispatch = backendChannel.send.bind(backendChannel);

    commands.forEach(cmd => {
        cmd(dispatch);
    });

    const app = document.querySelector('a-app') as App;
    if (!app) {
        throw new Error('No a-app element found in the document.');
    }

    app.addEventListener(ACTION_EVENT, (e) => {
        const action = (e as CustomEvent<Action>).detail;
        uiChannel.trySend(action);
    });

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
        let commands: Command[] = [];

        // Process actions from the UI channel
        while ((action = uiChannel.tryRecv())) {
            commands.push(...reducer(state, action));
            actionCount++;
        }

        if (actionCount > 4) {
            console.warn(`Strange: ${actionCount} ui actions received in a single frame. This might indicate a performance issue or a bug.`);
        }

        // While we have proccessed less than 16 actions, we can process backend actions
        while (actionCount < 16 && (action = backendChannel.tryRecv())) {
            commands.push(...reducer(state, action));
            actionCount++;
        }

        // Dispatch commands
        for (const cmd of commands) {
            cmd(dispatch);
        }

        // Render the updated state
        app.render(state);
    }
}

main().catch( e => console.log("Main exception:", e) );