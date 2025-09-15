import { Typography } from '@equinor/eds-core-react';
import { createRoot } from 'react-dom/client';

async function main() {
    const rootElement = document.getElementById('alice-root');
    if (!rootElement) {
        console.error('Root element not found looking for #alice-root');
        return;
    }
    const root = createRoot(rootElement);
    root.render(<Typography variant="h1">Hello, Alice!</Typography>);
}

main().catch(console.error);