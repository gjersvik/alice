import "./chat";
import "./loader";

import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Action, State } from "../state";

@customElement('a-app')
export default class App extends LitElement {
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
        return html`<a-loader .state=${this.state} .dispatch=${this.dispatch}></a-loader>
                <a-chat .state=${this.state} .dispatch=${this.dispatch}></a-chat>`;    
    }
}