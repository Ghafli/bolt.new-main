import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { Chat } from "~/app/types/chat";
import { Settings } from "~/app/types/settings";

interface BoltDB extends DBSchema {
  chats: {
    key: string;
    value: Chat;
  };
  settings: {
    key: string;
    value: Settings;
  };
}

const DB_NAME = "bolt-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BoltDB>> | null = null;

export const getDB = async () => {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = openDB<BoltDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore("chats", { keyPath: "id" });
      db.createObjectStore("settings", { keyPath: "id" });
    },
  });

  return dbPromise;
};
