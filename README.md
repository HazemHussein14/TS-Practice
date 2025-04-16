# TypeScript Utilities

A collection of lightweight, flexible TypeScript utilities for handling common asynchronous operation patterns in modern applications.

## Overview

This repository contains two main utilities:

1. **Promise Retry** - A mechanism for handling retries with exponential backoff and jitter
2. **Promise Cache** - A promise-based caching solution with automatic expiration

Both utilities are designed to be simple, type-safe, and require no external dependencies.

## Installation

```bash
# Clone the repository
git https://github.com/HazemHussein14/TS-Practice.git
cd TS-Practice

# Install dependencies
npm install

# Run examples
npm run retry    # Run the retry mechanism example
npm run cache    # Run the cache example
npm run dev-cache # Run cache with auto-reload (dev mode)
npm run dev-retry # Run retry mechanism with auto-reload (dev mode)
```

## Promise Retry Mechanism

A utility for handling retries with exponential backoff and jitter in TypeScript applications.

### Features

- Automatic retry of failed operations
- Exponential backoff strategy to prevent overwhelming the target system
- Random jitter to avoid thundering herd problems
- Configurable retry attempts, delays, and backoff parameters
- Detailed logging of retry attempts and outcomes

## Promise-Based Cache

A caching solution for TypeScript applications that handles promise-based asynchronous operations with built-in expiration support.

### Features

- **Promise Caching**: Cache asynchronous operation results efficiently
- **Automatic Expiration**: Items automatically expire after a configurable Time-To-Live (TTL)
- **Request Deduplication**: Concurrent requests for the same data return the same promise
- **Type Safety**: Full TypeScript support with generics
- **Cache Management**: Methods for manual deletion, clearing, and TTL adjustments
- **Auto-Cleanup**: Optional periodic cleaning of expired items
