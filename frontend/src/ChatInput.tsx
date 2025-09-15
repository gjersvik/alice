import { Button, TextField } from "@equinor/eds-core-react";
import styled from "styled-components";
import { Dispatch } from "./state";
import { useRef } from "react";

export default function ChatInput({dispatch}: {dispatch: Dispatch}) {
    const textRef = useRef(null);

    function sendMessage() {
        if (textRef.current) {
            const textELem = textRef.current as HTMLTextAreaElement;
            const text = textELem.value;
            dispatch({type: 'sendChat', text});
            textELem.value = '';
        }
    }

    return <Layout>
        <TextField 
            label="Type your message"
            placeholder="Type your message"
            multiline
            rowsMax={25}
            textareaRef={textRef}
            />
        <Button onClick={sendMessage}>Send</Button>
    </Layout>;
}

const Layout = styled.div`
    display: flex;
    gap: max(0.5rem, 8px);
    flex-direction: column;
    padding-bottom: max(0.5rem, 8px);
`;