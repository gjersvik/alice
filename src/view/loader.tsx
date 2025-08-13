import { Button, Dialog, LinearProgress } from "@equinor/eds-core-react";
import { Action, State } from "../state";

export default function Loader({ state, dispatch }: { state: State; dispatch: (action: Action) => void }) {
    return <Dialog open={!state.loader.loaded} isDismissable={false}>
        <Dialog.Header>
            <Dialog.Title>Loading Model</Dialog.Title>
        </Dialog.Header>
        <Dialog.CustomContent>
            <p>Welcome to Alice, your personal assistant.</p>
            <p>Right now we only support local language models.</p>
            <Button
                disabled={state.loader.loading}
                onClick={() => dispatch({ type: 'LoadModel' })}>
                {state.loader.cached ? "Load 2.5 Gig language model" : "Download and Load 2.5 Gig language model"}
            </Button>
            <LinearProgress value={state.loader.progress * 100} variant="determinate" />
            <p>{state.loader.loadMessage}</p>
        </Dialog.CustomContent>
    </Dialog>
}
