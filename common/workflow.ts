/** @module workflow 
 * The types and interfaces related to workflow engine core to alice.
 * 
 * At the high level a workflow is just a function that follows the rules of the workflow engine.
 * When a workflow is executed it will create a run. And the workflow will retry the same workflow from the top.
 * Until it succeeds or fails. That means that if the workflow stops half way it needs to get back to
 * the same state when it is retried. The workflow engine do not keep any state between retries.
 * 
 * This is done by making the workflow function pure. It can only use the input parameters and the actions.
 * And the actions must be idempotent. That means that they always return the same result when called with the same parameters.
 * So the workflow "runtime" state is kept in the actions cachees.
 * 
 * The workflow engine assumes single try is fast. Like running in a ui frame fast. 
 * The workflows and actions comunicate back using exceptions and return values.
 * 
 * The monst important exeptions are WaitUntil. This tells the workflow engine to try again at a later time.
 * Any unknown exeptions are treated as fatal errors and the workflow needs to be manually restarted.
 * 
 * As rule of thumb failures shuld be returned as values. And not thrown as exeptions.
 * Use exeptions to tell the developer that they have messed up. Not for run time errors.
 * 
 * Some time after a run have completed the workflow engine will archive the run.
 * Alloing the actions to forget and clean up any resources they have allocated for that run.
 * An arecived run can not be retryed.
*/

// Alice workflow uses JSON-compatible data structures all over the place.
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

// Exceptions

/** Exception to tell the workflow engine to pause and retry later.
 * The retryAt date is a hint. The workflow engine may retry at any time.
 * 
 * If the retryAt date is in the past that means retry at your earliest convinience.
 * 
 * If retryAt is later than the workflow timeout the engine may decide fail the workflow early.
 */
export class WaitUntil extends Error {
    public readonly retryAt: Date;

    constructor(retryAt: Date) {
        super(`Wait until ${retryAt.toISOString()}`);
        this.retryAt = retryAt;
    }
}

/** Exception to tell the workflow engine that the workflow will timeout.
 * 
 * This tells the workflow engine that there is no way to complete the workflow in time.
 * And any atempt is a waste of resources.
 * 
 * The workflow engine will not retry the workflow. It will early return to the caller with a timeout error.
 * The run can be manually retried later with a new timeout.
 */
export class WillTimeout extends Error {
    constructor() {
        super(`The workflow will timeout soon.`);
    }
}

/** Events that happen during workflow execution.
 *
 * Right now this is just a JsonObject, but we may want to define a more specific structure later. 
 */
export type Event = JsonObject;

/** The metadata for a workflow run. 
 * Metadata is used to pass information from the workflow engine to the actions.
 * Not now but in the future tings like users and other secuerty related information may be added.
 * 
 * METADATA IS READ-ONLY.
 * Any changes to the metadata will result in securety issues.
 * So any implementation of metadata must be deep frozen. Before its passed to the workflow or actions.
 */ 
export interface Metadata {
    /** The unique id for this workflow run. 
     * Use mainly for action to cache results.
    */
    readonly id: string;
    /** The time when the workflow run will timeout.
     * Actions can use this to decide if they have time to do something or not.
     * Workflows steps can generaly ignore this.
     */
    readonly timeoutAt?: Date;

    /** Log an event during the workflow execution.
     * The event will be stored in a runtime log for the workflow execution.
     * 
     * @param e The event to log.
     * @returns true if the event was logged.
     */
    log(e: Event);

    /** Wake up the workflow engine to retry this workflow run as soon as possible.
     * This can be used if the action have returned a Date before, but now have a result.
     * The workflow engine will retry the workflow run as soon as possible.
     * 
     * This is only a hint. The workflow engine may ignore this and retry at original time. 
     */
    wake();
}

/** Actions repersent what the workflow engine can do. What external servcies it can call.
 * 
 * ACTION MUST BE IDEMPOTENT.
 * If the action is called multiple times with the same input and meta.id it must return the same result.
 * The action may throw exeptions to tell the workflow engine to retry later or that it will timeout.
 * Even after a successfull return. If say the cache datastore is down or overloaded.
 * 
 * Action shuld not throw exeptions for run time errors. Use return values for that.
 * @throws WaitUntil To tell the workflow engine to retry later.
 * @throws WillTimeout To tell the workflow engine the risk of timeout is so high that it is not worth trying.
 * Any other exeption is treated as a fatal error and the workflow needs to be manually restarted.
 * 
 * If you do not know how long the action will take you can throw a WaitUntil with the timeout if set. Or when you belive ist must be done.
 * Then call the wake function on the context when you have a result.
 */
export type Action = (meta: Metadata, input: JsonValue) => JsonValue 

/** 
 * The workflow runtime will call this function when a run is archived.
 * This means that actions can delete any cached data they have for any runid that starts with the given prefix.
 * 
 * The runtime may call this function multiple times with the same prefix.
 * Or with prefixes that the service have never seen before.
 */
export interface Invalidation {
    invalidate(prefix: string): void;
}

/** Any workflow that is registered with the workflow engine must follow this shape.
 * 
 * The workflow must be a pure function. And must not have any side effects.
 * Gernaly a workflow shuld not need look at the context. Just pass it around to sub workflows and actions.
 * 
 * Workflows can call actions even if they are not pure. But the actions must be idempotent.
 * 
 * Workflows needs to return fast. So the pattern for parallel work is to run multiple sub workflows one after the other.
 * Catching any WaitUntil exeptions and returning throwing a new WaitUntil with the earliest retry time.
 * 
 * Running sub workflows is serial require no exseptions trickery. The normal exeption handling will just work.
 * 
 * Sub workflows that do not started by the workflow engine. Do not need to have this shape. And should define their own shape.
 * But the need to follow the same rules as other workflows. As in bering pure and idempotent.
 * 
 * @param meta The metadata for the workflow run. Workflows shuld gernaly just pass this around to actions and sub workflows.
 * @param input The input data for the workflow run. This is the data that is passed to the workflow when it is started.
 * @param structure The structure of the workflow. Right now this is just null, but it may be used later to define dynamic workflows.
 * @returns The output data for the workflow run. This is the data that is returned by the workflow when it is completed.
 */
export type Workflow = (meta: Metadata, input: JsonValue, structure: JsonValue) => JsonValue;