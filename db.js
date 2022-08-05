// https://dexie.org/docs/Tutorial/React
// But it doesnt fully work on Next.js!!

import Dexie from 'dexie';
import { indexedDB, IDBKeyRange } from "fake-indexeddb";

const args = (typeof window === 'undefined') ? { indexedDB: indexedDB, IDBKeyRange: IDBKeyRange } : undefined

export const db = new Dexie(
    'testDatabase',
    args
);
db.version(1).stores({
  games: '++id, gameType, colourPlaying, gameWon', // Primary key and indexed props
});