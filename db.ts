/*eslint require-await: "off"*/

// https://dexie.org/docs/Tutorial/React
// But it doesnt fully work on Next.js!!

import { Dexie } from 'dexie';

const args = ((typeof window === 'undefined') || !window.indexedDB) ? { indexedDB: (import("fake-indexeddb") as any).indexedDB, IDBKeyRange: (import("fake-indexeddb") as any).IDBKeyRange } : undefined

export const db: Dexie = new Dexie(
    'testDatabase',
    args
);
db.version(2).stores({
  games: '++id, gameType, colourPlaying, gameWon, [gameType+colourPlaying]', // Primary key and indexed props
});