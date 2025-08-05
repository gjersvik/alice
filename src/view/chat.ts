import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/scroller/scroller.js';
import '@awesome.me/webawesome/dist/components/textarea/textarea.js';

import { html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Action, initState, State } from "../state";

@customElement('a-chat')
export class ChatElement extends LitElement {

    @property({attribute: false})
    accessor state!: State;

    @property({attribute: false})
    accessor dispatch!: (state: Action) => void;

    connectedCallback(): void {
        super.connectedCallback();
        if (!this.state || !this.dispatch) {
            throw new Error('Chat component requires state and dispatch properties to be set.');
        }
    }

    // Use light DOM rendering
    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this
    }

    protected render(): unknown {
        return html`
            <div class="wa-stack">
                <h2>Chat Component</h2>
                <wa-scroller orientation="vertical">
                    ${this.state.chat_log.map((message) => html`
                        <a-message .role=${message.role} .content=${message.content}></a-message>
                    `)}
                    ${this.state.chat_stream ? html`
                        <a-message role="assistant" content="${this.state.chat_stream}"></a-message>
                    ` : nothing}
                </wa-scroller>
                <wa-textarea
                    placeholder="Type your message..."
                    value=${this.state.chat_input}
                    @input=${(e: InputEvent) => {
                        const input = e.target as HTMLInputElement;
                        this.dispatch({ type: 'UserWrite', text: input.value });
                    }}
                    @keydown=${(e: KeyboardEvent) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                            e.preventDefault();
                            this.dispatch({ type: 'UserSend' });
                        }
                    }}
                    hint="Press Shift+Enter to send"
                ></wa-textarea>
                <wa-button
                    @click=${() => {
                        this.dispatch({ type: 'UserSend' });
                    }}
                >Send</wa-button>
            </div>
        `;
    }
}

@customElement('a-message')
export class Message extends LitElement {

    @property({type: String})
    accessor role: 'user' | 'assistant' | 'system' = 'user';

    @property({type: String})
    accessor content: string = '';

    protected render(): unknown {
        return html`
            <div>
                <strong>${this.role}:</strong> ${this.content}
            </div>
        `;
    }
}
