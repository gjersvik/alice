import * as webllm from '@mlc-ai/web-llm';

const MODEL = "Phi-3.5-mini-instruct-q4f16_1-MLC"

let model: webllm.MLCEngine | null = null;

export async function* inCache(): AsyncGenerator<boolean> {
    return await webllm.hasModelInCache(MODEL);
}

export async function* load(): AsyncGenerator<webllm.InitProgressReport, void> {
    // Queue to hold progress updates
    const queue: webllm.InitProgressReport[] = [];
    let resolve: ((value: unknown) => void) | null = null;

    // Callback pushes progress to queue and resolves the generator
    const initProgressCallback = (progress: webllm.InitProgressReport) => {
        queue.push(progress);
        if (resolve) {
            resolve(undefined);
            resolve = null;
        }
    };

    // Start loading the model
    const enginePromise = webllm.CreateMLCEngine(MODEL, { initProgressCallback });

    // Yield progress updates as they arrive
    while (true) {
        // Wait for next progress update
        if (queue.length === 0) {
            await new Promise(r => resolve = r);
        }
        while (queue.length > 0) {
            yield queue.shift()!;
        }
        // If engine is loaded, break
        if ((await Promise.race([enginePromise, Promise.resolve()])) === await enginePromise) {
            break;
        }
    }

    model = await enginePromise;
}