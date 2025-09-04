import { expect, test } from 'vitest'
import  Engine from './engine'
import { JsonObject, JsonValue, Metadata } from './workflow';

function test_workflow(meta: Metadata, input: JsonValue, structure: JsonValue): string {
    return "test_workflow";
}

test('A user shuld be able to reister workflow with the workflow engine', () => {
    const engine = new Engine();
    engine.registerWorkflow("test_workflow", test_workflow);
    expect(engine.hasWorkflow("test_workflow")).toBe(true);
})