# TypeScript Promise-Based Cache with Expiration

A lightweight, flexible caching solution for TypeScript applications that handles promise-based asynchronous operations with built-in expiration support.

## Features

- **Promise Caching**: Cache asynchronous operation results efficiently
- **Automatic Expiration**: Items automatically expire after a configurable Time-To-Live (TTL)
- **Request Deduplication**: Concurrent requests for the same data return the same promise
- **Type Safety**: Full TypeScript support with generics
- **Cache Management**: Methods for manual deletion, clearing, and TTL adjustments
- **Auto-Cleanup**: Optional periodic cleaning of expired items
- **Zero Dependencies**: No external dependencies required

## Installation

```bash
  # To run the code
  npm run cache
  # Run cache with auto-reload (dev)
  npm run dev-cache
```

## Usage

### Basic Usage

```typescript
import { PromiseCache } from "./cache/cache.ts";

// Create a cache with 5-minute default TTL
const dataCache = new PromiseCache<string, any>(5 * 60 * 1000);

// Start auto-cleanup every 10 minutes
dataCache.startAutoCleanup(10 * 60 * 1000);

// Use the cache
async function getData(id: string) {
  return dataCache.get(
    id,
    async () => {
      // This will only execute if not in cache or expired
      console.log(`Fetching data for ${id}...`);
      const response = await fetch(`https://api.example.com/data/${id}`);
      return response.json();
    },
    // Optional: Custom 30-minute TTL for this specific item
    30 * 60 * 1000
  );
}

// Usage example
async function main() {
  // First call fetches from API
  const data1 = await getData("item1");
  console.log(data1);

  // Second call uses cached result
  const data2 = await getData("item1");
  console.log(data2);

  // Different key fetches from API
  const data3 = await getData("item2");
  console.log(data3);
}

main();
```

### API Integration Example

This project includes examples for integrating with the RESTful API at https://api.restful-api.dev/objects.

```typescript
// Import the cache and setup functions
import {
  objectCache,
  objectsListCache,
  getAllObjects,
  getObjectById,
} from "./API/objects-api.ts";

async function demoApiIntegration() {
  // Get all objects (first call will fetch from API)
  const allObjects = await getAllObjects();
  console.log(`Retrieved ${allObjects.length} objects`);

  // Get a specific object
  if (allObjects.length > 0) {
    const firstObjectId = allObjects[0].id;
    const singleObject = await getObjectById(firstObjectId);
    console.log("Retrieved object:", singleObject);
  }
}
```

## API Reference

### `PromiseCache<K, V>`

Generic class for caching promise-based operations. `K` represents the key type and `V` represents the value type.

#### Constructor

```typescript
constructor((defaultTtl = 60000)); // Default TTL: 1 minute
```

#### Methods

| Method                                                                   | Description                                                                  |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `get(key: K, fetchFunction: () => Promise<V>, ttl?: number): Promise<V>` | Get an item from cache or fetch using the provided function if not available |
| `delete(key: K): boolean`                                                | Remove an item from cache                                                    |
| `clear(): void`                                                          | Clear entire cache                                                           |
| `has(key: K): boolean`                                                   | Check if a key exists and isn't expired                                      |
| `size(): number`                                                         | Get cache size                                                               |
| `setTtl(key: K, ttl: number): boolean`                                   | Set a new TTL for an existing item                                           |
| `cleanExpired(): number`                                                 | Clean expired items from cache and return count of removed items             |
| `startAutoCleanup(interval = 60000): void`                               | Start automatic cleanup at given interval                                    |
| `stopAutoCleanup(): void`                                                | Stop automatic cleanup                                                       |

## Examples

### Cache for API Requests

```typescript
const userCache = new PromiseCache<string, User>(5 * 60 * 1000);

async function getUser(userId: string): Promise<User> {
  return userCache.get(userId, async () => {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json() as Promise<User>;
  });
}
```
