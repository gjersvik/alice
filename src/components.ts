import { Action, State } from "./state";

export const ACTION_EVENT = 'a-action';

export abstract class StateComponent extends HTMLElement {
    /**
     * Called when the state is updated.
     * 
     * The default implementation render its children. And assumes that relevant dom tree is static.
     * 
     * @param state The current state of the application.
     * 
     * @remarks
     * This method should be overridden by subclasses to implement custom rendering logic.
     * It is called whenever the state changes, allowing components to update their UI accordingly.
     * Its the StateComponent's responsibility to make sure children are updated.
     * 
     * WARNING: Trying to render parents or siblings will result in an infinite loop.
     * Rendering children of other StateComponents will result in double rendering. Or worse.
     * 
     * stateChildren and renderChildren are provided to help with this.
     */
    public render(state: State): void {
        // Without a render method, the component should not update its UI.
        this.renderChildren(state, false);
    }


    protected dispatch(action: Action) {
        this.dispatchEvent(new CustomEvent(ACTION_EVENT, {
            detail: action,
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Get the list of direct descendant StateComponents. Even if there are other ellements in between.
     * 
     * Set `dirty` if you have chnages the dom and want to recalculate the list.
     * 
     * @param dirty 
     * @returns 
     */
    protected stateChildren(dirty = false): StateComponent[] {
        if (dirty) 
            this.dirtyDescendantList = true;
        if (this.dirtyDescendantList) {
            this.directDescendantStateComponents = [];
            this.dirtyDescendantList = false;

            // Use a TreeWalker to find all direct descendant StateComponents
            const walker = document.createTreeWalker(
                this,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: (node) => {
                        if (node instanceof StateComponent && node !== this) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );

            let currentNode = walker.nextNode();
            while (currentNode) {
                this.directDescendantStateComponents.push(currentNode as StateComponent);
                // Do not traverse into this node's children if it's a StateComponent
                currentNode = walker.nextSibling();
            }
        }

        return this.directDescendantStateComponents;
    }

    protected renderChildren(state: State, dirty = false): void {
        const children = this.stateChildren(dirty);
        for (const child of children) {
            child.render(state);
        }
    }

    private directDescendantStateComponents: StateComponent[] = [];
    private dirtyDescendantList: boolean = true;
    
    connectedCallback() {
        this.dirtyDescendantList = true;
    }

    disconnectedCallback() {
        this.dirtyDescendantList = true;
    }

    adoptedCallback() {
        this.dirtyDescendantList = true;
    }
}