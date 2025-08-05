

import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Action, State } from "../state";

@customElement('a-loader')
class LoaderComponent extends LitElement{
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
        const loader = this.state.loader;

        const buttonText = loader.cached ?
            "Load 2.5 Gig language model" :
            "Download and Load 2.5 Gig language model";
        const button = html`<wa-button ?disabled=${loader.loading} @click=${_ => this.dispatch({type: 'LoadModel'})}>${buttonText}</wa-button>`;

        return html`
            <wa-dialog ?open=${!loader.loaded} withoutHeader="true" @wa-hide="${(e: Event) => {
                if (!loader.loaded) {
                    e.preventDefault();
                }
            }}">
                <h2>Loading Model</h2>
                <div class="wa-stack">
                    <p>Welcome to Alice your personal assistant.</p>
                    <p>Right we only suport local lanuage model.</p>
                    ${button}
                    <wa-progress-bar value=${loader.progress * 100}></wa-progress-bar>
                    <p>${loader.loadMessage}</p>
                </div>
            </wa-dialog>
        `;
    }
}