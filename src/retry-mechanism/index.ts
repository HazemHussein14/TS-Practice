function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyJitterDelay(delay: number, jitterFactor: number = 0.5): number {
  const jitter = Math.random() * jitterFactor * delay;
  return delay + jitter - jitter / 2;
}

async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 5,
  baseDelay: number = 1000,
  backoffFactor: number = 2,
  jitterFactor: number = 0.5
): Promise<T> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      attempt++;

      console.log(`[Attempt ${attempt}] Starting function execution...`);

      const result = await fn();
      console.log(`[Attempt ${attempt}] Success!`);

      return result;
    } catch (error: unknown) {
      attempt++;

      const typedError = error as Error;

      if (attempt < retries) {
        const delay = baseDelay * Math.pow(backoffFactor, attempt - 1);
        const delayedWithJitter = applyJitterDelay(delay, jitterFactor);

        console.error(
          `[Attempt ${attempt}] Failed. Reason: ${typedError.message}`
        );
        console.warn(
          `Attempt ${attempt} failed. Retrying in ${Math.round(
            delayedWithJitter
          )}ms...`
        );
        await wait(delayedWithJitter);
      } else {
        console.error(`[Attempt ${attempt}] Final failure. Giving up.`);
        throw new Error(
          `[Attempt ${attempt}] Failed after ${retries} attempts. Last error: ${typedError.message}`
        );
      }
    }
  }

  throw new Error("Unexpected error in retryWithBackoff logic");
}

async function fetchData(): Promise<string> {
  // Simulate API call that randomly fails
  if (Math.random() < 0.7) throw new Error("Network error!");
  return "Fetched data!";
}

(async () => {
  try {
    const result = await retry(fetchData, 5, 1500, 2);
    console.log("Success:", result);
  } catch (err) {
    console.error("Failed after retries:", err);
  }
})();
