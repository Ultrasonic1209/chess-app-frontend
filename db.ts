// https://dexie.org/docs/Tutorial/React
// But it doesnt fully work on Next.js!!

import { Dexie } from 'dexie';

const args = ((typeof window === 'undefined') || !window.indexedDB) ? { indexedDB: import("fake-indexeddb").indexedDB, IDBKeyRange: import("fake-indexeddb").IDBKeyRange } : undefined

export const db: Dexie = new Dexie(
    'testDatabase',
    args
);
db.version(1).stores({
  games: '++id, gameType, colourPlaying, gameWon', // Primary key and indexed props
});