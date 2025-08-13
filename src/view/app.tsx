import Chat from "./chat";
import Loader from "./loader";


import { Action, State } from "../state";

export default function App({ state, dispatch }: { state: State; dispatch: (action: Action) => void }) {
    return <>
        <Loader state={state} dispatch={dispatch} />
        <Chat state={state} dispatch={dispatch} />
    </>;
}