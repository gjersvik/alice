import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/button/button.js';

import * as webllm from '@mlc-ai/web-llm';
import { CreateMLCEngine } from '@mlc-ai/web-llm';

const model = 'SmolLM2-360M-Instruct-q4f16_1-MLC';

async function main() {
    const list = document.getElementById('list');
    list?.addEventListener('click', e => {
        console.log(webllm.prebuiltAppConfig.model_list)
    })

    const load = document.getElementById('load');
    load?.addEventListener('click', async e => {
        let inCache = await webllm.hasModelInCache(model);
        console.log("Is SmolLM2-360M-Instruct-q4f16_1-MLC in cache?", inCache);

        const initProgressCallback = (progress) => {
            console.log("Model loading progress:", progress);
        };
        const engine = await CreateMLCEngine(model, { initProgressCallback });
        inCache = await webllm.hasModelInCache(model);
        console.log("Is SmolLM2-360M-Instruct-q4f16_1-MLC in cache?", inCache);
    })

    const unload = document.getElementById('unload');
    unload?.addEventListener('click', async e => {
        await webllm.deleteModelInCache(model)
        console.log(`Removed: ${model} i hope.`);
    })
}

main().catch( e => console.log("Main expesption:", e) );