import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/button/button.js';

async function main() {
    const button = document.getElementById('hello');
    button?.addEventListener('click', e => {
        console.log('Hello world.')
    })
}

main().catch( e => console.log("Main expesption:", e) );