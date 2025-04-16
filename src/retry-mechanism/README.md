# TypeScript Retry Mechanism

A lightweight, flexible utility for handling retries with exponential backoff and jitter in TypeScript applications.

## Features

- Automatic retry of failed operations
- Exponential backoff strategy to prevent overwhelming the target system
- Random jitter to avoid thundering herd problems
- Configurable retry attempts, delays, and backoff parameters
- Detailed logging of retry attempts and outcomes

## Running the Example

```bash
npm run retry
```

## Usage

### Basic Example

```typescript
import { retry } from "./index.ts";

async function fetchData() {
  // Your API call or operation that might fail
  const response = await fetch("https://api.example.com/data");
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

// Use the retry mechanism with default settings
try {
  const data = await retry(fetchData);
  console.log("Data retrieved successfully:", data);
} catch (error) {
  console.error("All retry attempts failed:", error);
}
```

### Advanced Configuration

```typescript
import { retry } from "./index.ts";

const result = await retry(
  () => criticalOperation(),
  5, // Number of retry attempts
  1000, // Base delay in milliseconds
  2, // Backoff factor (exponential growth)
  0.5 // Jitter factor (randomness)
);
```

## API Reference

### `retry<T>(fn, retries, baseDelay, backoffFactor, jitterFactor): Promise<T>`

Executes a function and automatically retries on failure with exponential backoff and jitter.

#### Parameters

| Parameter       | Type               | Default    | Description                                   |
| --------------- | ------------------ | ---------- | --------------------------------------------- |
| `fn`            | `() => Promise<T>` | (required) | Async function to execute and retry if needed |
| `retries`       | `number`           | `5`        | Maximum number of retry attempts              |
| `baseDelay`     | `number`           | `1000`     | Initial delay in milliseconds                 |
| `backoffFactor` | `number`           | `2`        | Multiplier for the delay after each failure   |
| `jitterFactor`  | `number`           | `0.5`      | Random factor (0-1) to vary the delay         |

#### Returns

- `Promise<T>`: Result of the successful function execution

#### Throws

- Error if all retry attempts fail, with details about the attempts and the last error message

## How It Works

1. The function attempts to execute the provided operation
2. If successful, it returns the result
3. If it fails, it waits for a calculated delay and retries
4. The delay increases exponentially with each attempt (baseDelay \* backoffFactor^attempt)
5. A random jitter is applied to the delay to prevent synchronized retries
6. After the maximum number of retries, it throws an error with details

## Logging

The retry mechanism includes console logging to help with debugging:

- Start of each attempt
- Success messages
- Error details on failure
- Retry timing information
