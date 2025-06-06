'use client';

import { createEdgeStoreProvider } from '@edgestore/react';
import { type EdgeStoreRouter } from '../app/api/edgestore/[...edgestore]/route';

const { EdgeStoreProvider, useEdgeStore } = createEdgeStoreProvider<EdgeStoreRouter>();

export { EdgeStoreProvider, useEdgeStore };

// Helper function to get typed bucket
export function getBucket(
client: EdgeStoreRouter, p0: string) {
  return client.buckets.publicFiles;
}