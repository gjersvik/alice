
import { hasModelInCache, InitProgressReport, MLCEngine } from '@mlc-ai/web-llm';

export type ProcessReport = {progress: number, text: string};
export type ProcessCallback = (report: ProcessReport) => void;

export default class WebLLM {
    private static ready: Promise<WebLLM> | null = null;

    static async getInstance(): Promise<WebLLM> {
        if (!WebLLM.ready) {
            WebLLM.ready = async function() {
                return new WebLLM();
            }();
        }
        return WebLLM.ready;
    }

    private prosessCallBack: ProcessCallback | null = null;
    private model: MLCEngine;

    private constructor() {
        this.model = new MLCEngine({
            initProgressCallback: (report: InitProgressReport) => {
                if (this.prosessCallBack) {
                    this.prosessCallBack({ progress: report.progress, text: report.text ?? "" });
                } else {
                    console.warn("No process callback set, ignoring progress report");
                }
            }
        });
    }

    inCache(): Promise<boolean> {
        return hasModelInCache(MODEL);
    }

    async load(onProgress: (progress: ProcessReport) => void): Promise<void> {
        if (this.prosessCallBack) {
            console.error("Overriding existing process callback");
        }

        this.prosessCallBack = onProgress;
        await this.model.reload(MODEL);
        this.prosessCallBack = null; // Clear callback after loading
    }

    async chatCompletion(messages: { role: 'user' | 'assistant' | 'system'; content: string }[], onChunk: (message: string) => void): Promise<string> {
        const chunks = await this.model.chat.completions.create({
            messages: messages,
            temperature: 0.7,
            stream: true});
        
        for await (const chunk of chunks) {
            if (chunk.choices.length > 0 && chunk.choices[0].delta.content) {
                onChunk(chunk.choices[0].delta.content);
            }
        }

        return await this.model.getMessage();
    }
}

const MODEL = "Phi-3.5-mini-instruct-q4f16_1-MLC"


