import { Action, initCommands, initState, reducer } from './state';
import Channel from './channel';
import Commander from './command';
import App from './view/app';
import { createRoot } from 'react-dom/client';


async function main() {
    let uiChannel = new Channel<Action>();
    let backendChannel = new Channel<Action>(16);

    const commander = new Commander(backendChannel);
    commander.run(initCommands());

    let state = initState();

    function dispatch(action: Action) {
        if (!uiChannel.trySend(action)) {
            console.error("UI channel is full, dropping action:", action);
        }
    }

    const root = createRoot(document.getElementById('app')!);
    root.render(<App state={state} dispatch={dispatch} />);

    while (true) {
        // Wait for next action
        await Promise.race([
            uiChannel.wait(),
            backendChannel.wait()
        ]);

        // Wait for animation frame to ensure UI updates
        await new Promise(resolve => requestAnimationFrame(resolve));

        // Drain actions from the UI channel
        let actions: Action[] = uiChannel.drain();

        if (actions.length > 4) {
            console.warn(`Strange: ${actions.length} ui actions received in a single frame. This might indicate a performance issue or a bug.`);
        }

        // Push from backend channel so that actions have maxium length of 16
        actions.push(...backendChannel.drain(16 - actions.length));

        // Process actions
        for (let action of actions) {
            let [newState, commands] = reducer(state, action);
            state = newState;

            // Dispatch commands to the backend channel
            if (commands.length > 0) {
                commander.run(commands);
            }
        }

        // Update the state to render the chnanges
        root.render(<App state={state} dispatch={dispatch} />);
    }
}

main().catch( e => console.error("Main exception:", e) );