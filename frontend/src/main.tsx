import { createRoot } from 'react-dom/client';
import App from './App';
import { init, Msg, update } from './state';
import Commander from './commands';

async function main() {
    // Setup state management
    let msgs: Msg[] = [];
    let resolve: ((msg: Msg) => void) | null = null;
    let [state, cmds] = init();

    function dispatch(msg: Msg) {
        msgs.push(msg);
        if (resolve) {
            resolve(msg);
            resolve = null;
        }
    }

    // Setup side-effects and commands.
    let commander = new Commander(dispatch);

    // Setup rendering
    const rootElement = document.getElementById('alice-root');
    if (!rootElement) {
        console.error('Root element not found looking for #alice-root');
        return;
    }
    const root = createRoot(rootElement);
    root.render(<App state={state} dispatch={dispatch} />);

    // The main aplication loop
    while (true) {
        // If there are no messages, wait for one
        if (msgs.length === 0) {
            await new Promise<Msg>(r => resolve = r);
        }

        // Process all messages
        for (const msg of msgs) {
            let [newState, newCmds] = update(state, msg);
            state = newState;
            cmds.push(...newCmds);
        }
        msgs = [];

        // Execute all commands
        commander.runAll(cmds);
        cmds = [];

        // Re-render UI
        root.render(<App state={state} dispatch={dispatch} />);
    }
}

main().catch(console.error);