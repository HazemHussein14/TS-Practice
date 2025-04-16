import { ApiObject } from "../types/objects";
import { objectCache, objectsListCache } from "../cache";

const API_BASE_URL = "https://api.restful-api.dev";

export async function getAllObjects(): Promise<ApiObject[]> {
  return objectsListCache.get(
    "all-objects", // cache key
    async () => {
      console.log("Fetching all objects from API...");
      const response = await fetch(`${API_BASE_URL}/objects`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const objects = (await response.json()) as ApiObject[];
      return objects;
    }
  );
}

// Example 2: Get a single object by ID with caching
export async function getObjectById(id: string): Promise<ApiObject> {
  return objectCache.get(`object-${id}`, async () => {
    console.log(`Fetching object with ID ${id} from API...`);
    const response = await fetch(`${API_BASE_URL}/objects/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const object = (await response.json()) as ApiObject;
    return object;
  });
}

export async function createObject(name: string, data: any): Promise<ApiObject> {
  console.log("Creating new object...");
  const response = await fetch(`${API_BASE_URL}/objects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, data }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const newObject = (await response.json()) as ApiObject;

  // Invalidate the all-objects cache since we added a new item
  objectsListCache.delete("all-objects");

  return newObject;
}

export async function deleteObject(id: string): Promise<{ message: string }> {
  console.log(`Deleting object with ID ${id}...`);
  const response = await fetch(`${API_BASE_URL}/objects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  // Invalidate both the specific object cache and the all-objects cache
  objectCache.delete(`object-${id}`);
  objectsListCache.delete("all-objects");

  const message = (await response.json()) as { message: string };
  return message;
}
