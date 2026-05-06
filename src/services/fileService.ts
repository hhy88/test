interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

const DB_NAME = 'markedit-files';
const DB_VERSION = 1;
const STORE_NAME = 'files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'path' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function hasFileSystemAccess(): boolean {
  return 'showOpenFilePicker' in window && 'showDirectoryPicker' in window;
}

export async function readFile(path: string): Promise<string> {
  if (hasFileSystemAccess()) {
    const [handle] = await (window as any).showOpenFilePicker();
    const file = await handle.getFile();
    return file.text();
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(path);
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.content);
      } else {
        reject(new Error(`File not found: ${path}`));
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function writeFile(path: string, content: string): Promise<void> {
  if (hasFileSystemAccess()) {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: path.split('/').pop(),
      types: [
        {
          description: 'Markdown',
          accept: { 'text/markdown': ['.md'] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    return;
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ path, content, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function createFile(name: string, folder: string): Promise<string> {
  const path = folder ? `${folder}/${name}` : name;

  if (hasFileSystemAccess()) {
    const dirHandle = await (window as any).showDirectoryPicker();
    const fileHandle = await dirHandle.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write('');
    await writable.close();
    return path;
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ path, content: '', updatedAt: Date.now() });
    tx.oncomplete = () => resolve(path);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteFile(path: string): Promise<void> {
  if (hasFileSystemAccess()) {
    const [handle] = await (window as any).showOpenFilePicker();
    await handle.remove();
    return;
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(path);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function renameFile(oldPath: string, newPath: string): Promise<void> {
  if (hasFileSystemAccess()) {
    const [handle] = await (window as any).showOpenFilePicker();
    const file = await handle.getFile();
    const content = await file.text();
    await handle.remove();

    const dirHandle = await (window as any).showDirectoryPicker();
    const newName = newPath.split('/').pop()!;
    const newHandle = await dirHandle.getFileHandle(newName, { create: true });
    const writable = await newHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return;
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(oldPath);
    getReq.onsuccess = () => {
      const record = getReq.result;
      if (record) {
        record.path = newPath;
        store.put(record);
        store.delete(oldPath);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function readDirectory(path: string): Promise<FileNode[]> {
  if (hasFileSystemAccess()) {
    const dirHandle = await (window as any).showDirectoryPicker();
    const children: FileNode[] = [];

    for await (const entry of dirHandle.values()) {
      const node: FileNode = {
        name: entry.name,
        path: path ? `${path}/${entry.name}` : entry.name,
        type: entry.kind as 'file' | 'directory',
      };

      if (entry.kind === 'directory') {
        const subChildren = await readDirectory(node.path);
        node.children = subChildren;
      }

      children.push(node);
    }

    return children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const records: { path: string }[] = request.result;
      const prefix = path ? `${path}/` : '';
      const nodes: FileNode[] = [];

      for (const record of records) {
        if (!record.path.startsWith(prefix)) continue;
        const relative = record.path.slice(prefix.length);
        const parts = relative.split('/');
        if (parts.length === 1) {
          nodes.push({
            name: parts[0],
            path: record.path,
            type: 'file',
          });
        }
      }

      resolve(nodes.sort((a, b) => a.name.localeCompare(b.name)));
    };
    request.onerror = () => reject(request.error);
  });
}
