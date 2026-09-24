/**
 * PREMIER UNIVERSITY - RESILIENT DOCUMENT STORAGE (INDEXEDDB)
 * Stores applicant and institutional document uploads safely in browser IndexedDB.
 * Prevents localStorage 5MB QuotaExceededError when applicants upload 5MB-10MB files.
 */

const DB_NAME = 'PremierUniversityStorage';
const DB_VERSION = 1;
const STORE_NAME = 'document_blobs';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

// In-memory quick cache for active session
const memoryCache = new Map<string, string>();

export const indexedDbStorage = {
  /**
   * Save a document's file data (data URI or Blob) to IndexedDB
   */
  async saveDocumentBlob(docId: string, data: string): Promise<void> {
    memoryCache.set(docId, data);
    try {
      const db = await getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(data, docId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('[indexedDbStorage] Falling back to in-memory store:', e);
    }
  },

  /**
   * Retrieve a document's file data from IndexedDB or memory cache
   */
  async getDocumentBlob(docId: string): Promise<string | null> {
    if (memoryCache.has(docId)) {
      return memoryCache.get(docId)!;
    }

    try {
      const db = await getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(docId);
        req.onsuccess = () => {
          const result = req.result as string || null;
          if (result) memoryCache.set(docId, result);
          resolve(result);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('[indexedDbStorage] Failed to read from IndexedDB:', e);
      return null;
    }
  },

  /**
   * Remove a document from IndexedDB
   */
  async deleteDocumentBlob(docId: string): Promise<void> {
    memoryCache.delete(docId);
    try {
      const db = await getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(docId);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('[indexedDbStorage] Failed to delete from IndexedDB:', e);
    }
  }
};

/**
 * Strips heavy base64 strings from documents to guarantee localStorage
 * remains tiny (<50KB) and NEVER triggers browser QuotaExceededError.
 */
export function sanitizeApplicationForStorage(app: any): any {
  if (!app) return app;
  const docs = Array.isArray(app.documents) 
    ? app.documents.map((d: any) => {
        if (d && d.fileUrl && d.fileUrl.length > 300) {
          indexedDbStorage.saveDocumentBlob(d.id, d.fileUrl).catch(() => {});
          return {
            ...d,
            fileUrl: `indexeddb:${d.id}`
          };
        }
        return d;
      })
    : [];

  return {
    ...app,
    documents: docs
  };
}

export function sanitizeApplicationsForStorage(apps: any[]): any[] {
  if (!Array.isArray(apps)) return [];
  return apps.map(sanitizeApplicationForStorage);
}

