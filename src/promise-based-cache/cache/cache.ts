interface CacheItem<T> {
  value: T;
  expiry: number;
}

export class PromiseCache<K, V> {
  private cache: Map<K, CacheItem<Promise<V>>>;
  private defaultTtl: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(defaultTtl = 60000, cleanupIntervalMs = 60000) {
    this.cache = new Map();
    this.defaultTtl = defaultTtl;

    this.cleanupInterval = setInterval(() => {
      this.cleanExpired();
    }, cleanupIntervalMs);
  }

  async get(key: K, fetchFn: () => Promise<V>, ttl?: number): Promise<V> {
    const now = Date.now();
    const existingItem = this.cache.get(key);

    if (existingItem && existingItem.expiry > now) {
      return existingItem.value;
    }

    const promise = fetchFn();
    const expiry = now + (ttl ?? this.defaultTtl);
    this.cache.set(key, { value: promise, expiry });

    return promise;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: K): boolean {
    const item = this.cache.get(key);
    return !!item && item.expiry > Date.now();
  }

  size(): number {
    return this.cache.size;
  }

  setTtl(key: K, ttl: number) {
    const item = this.cache.get(key);
    if (!item) return false;

    item.expiry = Date.now() + ttl;
    return true;
  }

  cleanExpired(): number {
    const now = Date.now();
    let count = 0;

    this.cache.forEach((item, key) => {
      if (item.expiry <= now) {
        this.cache.delete(key);
        count++;
      }
    });
    return count;
  }

  // Optional: allow manual cleanup stop if needed
  dispose(): void {
    clearInterval(this.cleanupInterval);
  }
}
