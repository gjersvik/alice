import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import { marked } from "marked";
import { useMemo } from 'react';
import { Action, State } from "../state";
import DOMPurify from 'dompurify';

export default function Chat({ state, dispatch }: { state: State; dispatch: (action: Action) => void }) {
    let messages = state.chat_log.map((message) => ({
        role: message.role,
        content: message.content,
    }));

    if (state.chat_stream) {
        messages.push({
            role: 'assistant',
            content: state.chat_stream,
        });
    }

    return <MainContainer>
        <ChatContainer>
            <MessageList>
                {messages.map((message, index) => (
                    <ChatMessage key={index} role={message.role} content={message.content} />
                ))}
            </MessageList>
            <MessageInput 
                sendOnReturnDisabled={true}
                attachButton={false}
                onSend={(_, text) => {
                    if (text.trim()) {
                        // TODO: Combine into a single action
                        dispatch({ type: 'UserWrite', text: text });
                        dispatch({ type: 'UserSend' });
                    }
                }}
                placeholder="Type message here" />
        </ChatContainer>
    </MainContainer>;
}

function ChatMessage({ role, content }: { role: 'user' | 'assistant' | 'system'; content: string }) {
    let html = useMemo(() => {
        const rawHtml = marked.parse(content) as string;
        return DOMPurify.sanitize(rawHtml);
    }, [content]);

    return <Message model={{
        message: html,
        type: 'html',
        sender: role === 'user' ? 'You' : role === 'assistant' ? 'Alice' : 'System',
        direction: role === 'user' ? 'outgoing' : 'incoming',
        position: 'single',
    }} />;
}

