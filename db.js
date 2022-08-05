// https://dexie.org/docs/Tutorial/React
// But it doesnt fully work on Next.js!!

import Dexie from 'dexie';
import { indexedDB, IDBKeyRange } from "fake-indexeddb";

const args = (typeof window === 'undefined') ? { indexedDB: indexedDB, IDBKeyRange: IDBKeyRange } : undefined

export const db = new Dexie(
    'testDatabase',
    args
);
db.delete().then(() => db.open());
db.version(1).stores({
  games: '++id, gameType, gameWasWon', // Primary key and indexed props
});