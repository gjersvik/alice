import { Metadata, JsonObject, Workflow } from "./workflow";

export default class Engine {
    private regisstry: Map<string, Workflow> = new Map();

    hasWorkflow(name: string): boolean {
        return this.regisstry.has(name);
    }
    registerWorkflow(name: string, test_workflow: Workflow): void {
        this.regisstry.set(name, test_workflow);
    }
}