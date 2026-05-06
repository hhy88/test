interface BackupRecord {
  documentId: string;
  content: string;
  timestamp: number;
}

interface SessionState {
  openFiles: string[];
  activeFile: string | null;
  cursorPositions: Record<string, { line: number; column: number }>;
  scrollPositions: Record<string, number>;
  timestamp: number;
}

const DB_NAME = 'markedit-backup-db';
const DB_VERSION = 1;
const BACKUP_STORE = 'markedit-backups';
const SESSION_STORE = 'markedit-session';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BACKUP_STORE)) {
        const store = db.createObjectStore(BACKUP_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('documentId', 'documentId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains(SESSION_STORE)) {
        db.createObjectStore(SESSION_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveBackup(documentId: string, content: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BACKUP_STORE, 'readwrite');
    const store = tx.objectStore(BACKUP_STORE);
    store.add({
      documentId,
      content,
      timestamp: Date.now(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getBackups(documentId: string): Promise<BackupRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BACKUP_STORE, 'readonly');
    const store = tx.objectStore(BACKUP_STORE);
    const index = store.index('documentId');
    const request = index.getAll(documentId);
    request.onsuccess = () => {
      const records = request.result as BackupRecord[];
      records.sort((a, b) => b.timestamp - a.timestamp);
      resolve(records);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function restoreBackup(documentId: string, timestamp: number): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BACKUP_STORE, 'readonly');
    const store = tx.objectStore(BACKUP_STORE);
    const index = store.index('documentId');
    const request = index.getAll(documentId);
    request.onsuccess = () => {
      const records = request.result as BackupRecord[];
      const backup = records.find((r) => r.timestamp === timestamp);
      resolve(backup ? backup.content : null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function cleanOldBackups(documentId: string, keepCount: number): Promise<void> {
  const db = await openDB();
  const backups = await getBackups(documentId);

  if (backups.length <= keepCount) return;

  const toDelete = backups.slice(keepCount);

  return new Promise((resolve, reject) => {
    const tx = db.transaction(BACKUP_STORE, 'readwrite');
    const store = tx.objectStore(BACKUP_STORE);
    for (const backup of toDelete) {
      store.delete((backup as any).id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function recoverSession(): Promise<SessionState | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SESSION_STORE, 'readonly');
    const store = tx.objectStore(SESSION_STORE);
    const request = store.get('current');
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveSession(session: SessionState): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SESSION_STORE, 'readwrite');
    const store = tx.objectStore(SESSION_STORE);
    store.put({
      id: 'current',
      ...session,
      timestamp: Date.now(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
