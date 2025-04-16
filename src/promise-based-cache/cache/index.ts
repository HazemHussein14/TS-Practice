import { PromiseCache } from "./cache";
import { ApiObject } from "../types/objects";

// 5 minutes cache
export const objectCache = new PromiseCache<string, ApiObject>(5 * 60 * 1000);
export const objectsListCache = new PromiseCache<string, ApiObject[]>(5 * 60 * 1000);

// Start auto-cleanup every 10 minutes
objectCache.startAutoCleanup(10 * 60 * 1000);
objectsListCache.startAutoCleanup(10 * 60 * 1000);
