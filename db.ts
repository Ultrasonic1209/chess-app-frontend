// https://dexie.org/docs/Tutorial/React
// But it doesnt fully work on Next.js!!

import { Dexie } from 'dexie';

const args = ((typeof window === 'undefined') || !window.indexedDB) ? { indexedDB: (await import("fake-indexeddb")).indexedDB, IDBKeyRange: (await import("fake-indexeddb")).IDBKeyRange } : undefined

export const db: Dexie = new Dexie(
    'testDatabase',
    args
);
db.version(2).stores({
  games: '++id, gameType, colourPlaying, gameWon, [gameType+colourPlaying]', // Primary key and indexed props
});