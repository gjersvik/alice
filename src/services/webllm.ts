import * as webllm from '@mlc-ai/web-llm';

const MODEL = "Phi-3.5-mini-instruct-q4f16_1-MLC"

let model: webllm.MLCEngine | null = null;

export function inCache(): Promise<boolean> {
    return webllm.hasModelInCache(MODEL);
}

export async function load(onProgress?: (progress: webllm.InitProgressReport) => void): Promise<void>{
    model = await webllm.CreateMLCEngine(MODEL, { initProgressCallback: onProgress });
}