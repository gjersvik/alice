import styled from "styled-components";
import { State } from "./state";

export default function ChatLog({state}: {state: State}) {
    return <MessageList>
        {state.chat.map((message, index) => (
            <MessageItem key={index} role={message.role}>
                {message.content}
            </MessageItem>
        ))}
    </MessageList>;
}

const MessageList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    padding: 10px;
`;

const MessageItem = styled.div<{role: 'user' | 'assistant'}>`
    background-color: ${props => props.role === 'user' ? '#DCF8C6' : '#EAEAEA'};
    align-self: ${props => props.role === 'user' ? 'flex-end' : 'flex-start'};
    border-radius: 10px;
    padding: 8px 12px;
    max-width: 80%;
    white-space: pre-wrap;
`;