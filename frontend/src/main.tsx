import { createRoot } from 'react-dom/client';
import App from './App';

async function main() {

    const rootElement = document.getElementById('alice-root');
    if (!rootElement) {
        console.error('Root element not found looking for #alice-root');
        return;
    }
    const root = createRoot(rootElement);
    root.render(<App dispatch={console.log} />);
}

main().catch(console.error);