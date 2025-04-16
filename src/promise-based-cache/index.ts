import {
  getAllObjects,
  getObjectById,
  createObject,
  deleteObject,
} from "./API/objects-api";
import { objectCache, objectsListCache } from "./cache";

async function main() {
  try {
    // Get all objects (first call will fetch from API)
    console.log("First call to get all objects:");
    const allObjects = await getAllObjects();
    console.log(`Retrieved ${allObjects.length} objects`);

    // Get all objects again (should use cache)
    console.log("\nSecond call to get all objects (should use cache):");
    const cachedObjects = await getAllObjects();
    console.log(`Retrieved ${cachedObjects.length} objects from cache`);

    // Get a specific object
    if (allObjects.length > 0) {
      const firstObjectId = allObjects[0].id;

      console.log(`\nGetting object with ID ${firstObjectId}:`);
      const singleObject = await getObjectById(firstObjectId);
      console.log("Retrieved object:", singleObject);

      console.log(`\nGetting the same object again (should use cache):`);
      const cachedObject = await getObjectById(firstObjectId);
      console.log("Retrieved cached object:", cachedObject);
    }

    // Create a new object
    console.log("\nCreating a new object:");
    const newObject = await createObject("New Test Object", {
      year: 2025,
      price: 999,
      category: "Test",
    });
    console.log("Created new object:", newObject);

    // Get all objects again (should fetch from API since cache was invalidated)
    console.log("\nGetting all objects again (should fetch from API):");
    const refreshedObjects = await getAllObjects();
    console.log(`Retrieved ${refreshedObjects.length} objects`);

    // Clean up - delete the object we created
    if (newObject && newObject.id) {
      console.log(`\nDeleting the object with ID ${newObject.id}:`);
      const deleteResult = await deleteObject(newObject.id);
      console.log("Delete result:", deleteResult);
    }

    // Show cache stats
    console.log("\nCache Statistics:");
    console.log(`Object Cache Size: ${objectCache.size()}`);
    console.log(`Objects List Cache Size: ${objectsListCache.size()}`);

    // Clean expired items
    const cleanedItemsCount =
      objectCache.cleanExpired() + objectsListCache.cleanExpired();
    console.log(`\nCleaned ${cleanedItemsCount} expired items from caches`);

    // Stop auto-cleanup when done
    objectCache.stopAutoCleanup();
    objectsListCache.stopAutoCleanup();
  } catch (error) {
    console.error("Error in main:", error);
  }
}

main()
