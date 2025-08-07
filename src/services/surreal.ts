import SurrealDB  from 'surrealdb';
// This is temporary, the real server will be IndexedDB
const SERVER_URL = 'ws://localhost:8000/rpc';

export default class Surreal {
    private static ready: Promise<Surreal> | null = null;

    static async getInstance(): Promise<Surreal> {
        if (!Surreal.ready) {
            Surreal.ready = (async function() {
                let db = new SurrealDB();

                await db.connect(SERVER_URL);

                await db.use({
                    namespace: 'test',
                    database: 'test'
                });

                await db.signin({
                    username: 'admin',
                    password: 'playwithdata'
                });

                const versionResponse = await fetch('http://127.0.0.1:8000/version');
                const version = await versionResponse.text();
                console.log(`Connected to SurrealDB version: ${version}`);

                return new Surreal(db);
            })();
        }
        return Surreal.ready;
    }

    private db: SurrealDB;

    private constructor(db: SurrealDB) {
        this.db = db;
    }
}