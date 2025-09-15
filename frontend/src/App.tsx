import { Typography } from "@equinor/eds-core-react";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    html, body, #alice-root {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
    }
    
    #alice-root {
        display: grid;
        grid-template-rows: auto 1fr;
        grid-template-columns: auto 1fr auto;
        grid-template-areas:
            "header header header"
            "left main right"
    }
`;

export default function App() {
  return <>
    <GlobalStyles />
    <StyledHeader />
    <StyledMain />
  </>;
}

const StyledHeader = styled(Header)`
  grid-area: header;
  background-color: lightgray;
`;

const StyledMain = styled(Main)`
  grid-area: main;
`;

function Header({className}: {className?: string}) {
  return <header className={className}>
    <Typography variant="h1">Alice</Typography>
  </header>;
}

function Main({className}: {className?: string}) {
    return <Container className={className}>
        <ChatLog />
        <MessageInput />
    </Container> 
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
`;

function ChatLog() {
    return <MessageList>
    </MessageList>;
}

const MessageList = styled.div`
    flex: 1;
`;

function MessageInput() {
    return <InputContainer>
    </InputContainer>;
}

const InputContainer = styled.div`
    display: flex; 
`;