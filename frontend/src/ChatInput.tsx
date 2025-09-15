import { Button, TextField } from "@equinor/eds-core-react";
import styled from "styled-components";

export default function ChatInput() {
    return <Layout>
        <TextField label="Type your message" placeholder="Type your message" multiline rowsMax={25}/>
        <Button>Send</Button>
    </Layout>;
}

const Layout = styled.div`
    display: flex;
    gap: max(0.5rem, 8px);
    flex-direction: column;
    padding-bottom: max(0.5rem, 8px);
`;