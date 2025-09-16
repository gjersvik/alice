import { TopBar } from "@equinor/eds-core-react";
import styled, { createGlobalStyle } from "styled-components";
import ChatInput from "./ChatInput";
import { Dispatch, State } from "./state";
import ChatLog from "./ChatLog";

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

export default function App({state, dispatch}: {state: State, dispatch: Dispatch}) {
  return <>
    <GlobalStyles />
    <Header>
        <TopBar.Header>
            Alice - Chat
        </TopBar.Header>
    </Header>
    <Main>
        <ChatLog state={state} />
        <ChatInput dispatch={dispatch} />
    </Main> 
  </>;
}

const Header = styled(TopBar)`
  grid-area: header;
`;

const Main = styled.div`
    grid-area: main;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
`;
